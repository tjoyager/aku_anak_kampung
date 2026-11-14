import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import { Icon } from "./components/ui/Icons";
import { AppHeader } from "./components/layout/AppHeader";

/* -------------------------------------------------------------------------- */
/*  Leaflet: fix default icon + custom markers                                */
/* -------------------------------------------------------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const hospitalIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 32px; height: 32px;
    background: #0066cc;
    border: 3px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(0,102,204,0.4);
    display: flex; align-items: center; justify-content: center;
  ">
    <div style="
      transform: rotate(45deg);
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      font-family: sans-serif;
    ">+</div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 20px; height: 20px;
    background: #0066cc;
    border: 4px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(0,102,204,0.25), 0 4px 12px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* -------------------------------------------------------------------------- */
/*  MapController: fly to center                                              */
/* -------------------------------------------------------------------------- */
function MapController({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Helper: buka rute di Google Maps                                          */
/* -------------------------------------------------------------------------- */
function openRouteToHospital(
  hospital: { latitude: number; longitude: number },
  userLocation: [number, number] | null
) {
  const destination = `${hospital.latitude},${hospital.longitude}`;
  const origin = userLocation ? `${userLocation[0]},${userLocation[1]}` : "";
  const url = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${destination}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
}

interface NearbyHospitalsMapProps {
  user: User | null;
  onBack: () => void;
  onNotify?: (msg: string) => void;
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */
export default function NearbyHospitalsMap({
  user,
  onBack,
  onNotify,
}: NearbyHospitalsMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ----------------------------- Load data ----------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation tidak didukung oleh browser Anda.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);

        const { data, error } = await supabase.rpc("get_nearby_hospitals", {
          user_lat: latitude,
          user_lng: longitude,
          radius_meters: 50000,
          max_results: 50,
        });

        if (error) {
          console.error(error);
          setErrorMsg("Gagal mengambil data rumah sakit: " + error.message);
        } else {
          setHospitals(data || []);
        }
        setLoading(false);
      },
      (error) => {
        setErrorMsg(
          "Gagal mendapatkan lokasi Anda. Pastikan izin lokasi aktif. (" +
            error.message +
            ")"
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  /* --------------------------- Filter list ---------------------------- */
  const filteredHospitals = useMemo(() => {
    if (!searchQuery.trim()) return hospitals;
    const q = searchQuery.toLowerCase();
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
    );
  }, [hospitals, searchQuery]);

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setMapCenter([hospital.latitude, hospital.longitude]);
  };

  /* ----------------------------- Loading ------------------------------ */
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fb]">
        <AppHeader
          user={user}
          onNotify={onNotify}
          leftAction={
            <div></div>
          }
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#eaf4ff] border-t-[#0066cc] animate-spin" />
          <p className="text-slate-500 text-[13px] font-medium">
            Mencari lokasi dan rumah sakit terdekat...
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------ Error ------------------------------- */
  if (errorMsg) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fb]">
        <AppHeader
          user={user}
          onNotify={onNotify}
          leftAction={
            <div></div>
          }
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-red-50 border border-red-100 text-center">
            <div className="w-12 h-12 grid place-items-center mx-auto mb-3 rounded-full bg-red-100 text-red-600">
              <Icon name="close" size={22} />
            </div>
            <strong className="block text-red-700 text-[14px] mb-1">
              Terjadi Kesalahan
            </strong>
            <p className="text-red-600 text-[12.5px] leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fb]">
        <AppHeader
          user={user}
          onNotify={onNotify}
          leftAction={
            <div></div>
          }
        />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-[13px]">
          Lokasi tidak tersedia.
        </div>
      </div>
    );
  }

  /* ------------------------------ Main UI ------------------------------ */
  return (
    <div className="flex flex-col h-screen w-full bg-[#f6f8fb]">
      {/* ================= HEADER UTAMA ================= */}
      <AppHeader
        user={user}
        onNotify={onNotify}
        leftAction={
          <div></div>
        }
      />

      {/* ================= PETA FULL SCREEN (SISA TINGGI) ================= */}
      <div className="relative flex-1 w-full overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} />

          {/* Marker user */}
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <strong className="text-[#0066cc]">Lokasi Anda Saat Ini</strong>
            </Popup>
          </Marker>

          {/* Marker rumah sakit */}
          {filteredHospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              icon={hospitalIcon}
              eventHandlers={{ click: () => setSelectedHospital(hospital) }}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <strong className="text-[14px] text-[#082d58] block">
                    {hospital.name}
                  </strong>
                  <span className="block mt-1 text-[12px] text-slate-600">
                    {hospital.address}
                  </span>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#eaf4ff] text-[#0066cc] text-[11px] font-bold">
                    {(hospital.distance_meters / 1000).toFixed(2)} km
                  </span>
                  <button
                    onClick={() => openRouteToHospital(hospital, userLocation)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0066cc] text-white text-[12px] font-bold hover:bg-[#0054ae] transition-colors cursor-pointer border-0"
                  >
                    Buka Rute
                    <Icon name="arrow" size={13} />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

                {/* ================= SIDEBAR MENGAMBANG (desktop) ================= */}
        <div className="hidden md:flex absolute top-4 left-4 bottom-4 w-[380px] flex-col bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] overflow-hidden z-[1000]">
          {/* Search bar */}
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari rumah sakit atau alamat..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all"
              />
            </div>
          </div>

          {/* Info hasil */}
          <div className="px-4 py-2 bg-[#eaf4ff] border-b border-[#d3e6f7] shrink-0">
            <p className="text-[#0066cc] text-[11.5px] font-semibold">
              {filteredHospitals.length} rumah sakit ditemukan dalam radius 50 km
            </p>
          </div>

          {/* List rumah sakit */}
          <div className="flex-1 overflow-y-auto">
            {filteredHospitals.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  Tidak ada rumah sakit yang cocok.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredHospitals.map((hospital) => {
                  const isSelected = selectedHospital?.id === hospital.id;
                  return (
                    <li key={hospital.id}>
                      <div
                        className={`p-4 transition-colors ${
                          isSelected ? "bg-[#eaf4ff]" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <button
                          onClick={() => handleSelectHospital(hospital)}
                          className="w-full text-left bg-transparent border-0 p-0 cursor-pointer"
                        >
                          <div className="flex flex-col gap-1">
                            <h3 className="text-slate-800 font-manrope font-bold text-[14px] leading-snug truncate">
                              {hospital.name}
                            </h3>
                            <p className="text-slate-500 text-[12.5px] leading-snug line-clamp-2">
                              {hospital.address}
                            </p>
                          </div>
                        </button>

                        {/* Baris Jarak & Tombol Rute (Tanpa padding-left karena ikon sudah dihapus) */}
                        <div className="flex items-center justify-between mt-3 gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eaf4ff] text-[#0066cc] text-[11.5px] font-bold">
                            <Icon name="location" size={12} />
                            {(hospital.distance_meters / 1000).toFixed(2)} km
                          </span>
                          <button
                            onClick={() => openRouteToHospital(hospital, userLocation)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066cc] text-white text-[11.5px] font-bold hover:bg-[#0054ae] transition-colors"
                          >
                            Lihat Rute
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Tombol Kembali di bawah Sidebar */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[13px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
        </div>

        {/* ================= FLOATING CONTROLS (kanan bawah) ================= */}
        <div className="absolute right-4 bottom-[calc(45vh+16px)] md:bottom-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => {
              if (userLocation) setMapCenter([...userLocation]);
            }}
            className="w-11 h-11 grid place-items-center rounded-xl bg-white shadow-lg border border-slate-200 text-[#0066cc] hover:bg-slate-50 transition-colors"
            aria-label="Kembali ke lokasi saya"
          >
            <Icon name="location" size={20} />
          </button>
        </div>

        {/* ================= FLOATING INFO CARD (desktop) ================= */}
        {selectedHospital && (
          <div className="hidden md:block absolute bottom-4 left-[400px] md:right-auto md:w-[340px] z-[1000] p-4 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-slate-200">
            <button
              onClick={() => setSelectedHospital(null)}
              className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-0 cursor-pointer"
              aria-label="Tutup"
            >
              <Icon name="close" size={14} />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <div className="flex-none w-10 h-10 grid place-items-center rounded-xl bg-[#eaf4ff] text-[#0066cc]">
                <Icon name="hospital" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block text-[#082d58] font-manrope font-bold text-[13.5px] leading-snug">
                  {selectedHospital.name}
                </strong>
                <p className="mt-0.5 text-slate-500 text-[11.5px] leading-snug line-clamp-2">
                  {selectedHospital.address}
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-[#eaf4ff] text-[#0066cc] text-[10.5px] font-bold">
                  <Icon name="location" size={10} />
                  {(selectedHospital.distance_meters / 1000).toFixed(2)} km
                </span>
              </div>
            </div>
            <button
              onClick={() => openRouteToHospital(selectedHospital, userLocation)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0066cc] text-white text-[12px] font-bold hover:bg-[#0054ae] transition-colors border-0"
            >
              Mulai Rute ke Sini
              <Icon name="arrow" size={13} />
            </button>
          </div>
        )}

        {/* ================= BOTTOM SHEET LIST (mobile) ================= */}
        <div className="md:hidden absolute bottom-0 inset-x-0 z-[1000] bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] max-h-[45vh] flex flex-col">
          {/* Handle bar */}
          <div className="flex justify-center pt-2 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-slate-300" />
          </div>

          {/* Info baris ringkas */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-[#0066cc] text-[12px] font-bold">
              {filteredHospitals.length} Rumah Sakit Terdekat
            </span>
          </div>

          {/* Search */}
          <div className="px-4 py-2 shrink-0">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari rumah sakit..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[12.5px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0066cc] transition-all"
              />
            </div>
          </div>

          {/* List scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filteredHospitals.length === 0 ? (
              <p className="p-4 text-center text-slate-500 text-[12.5px]">
                Tidak ada rumah sakit yang cocok.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredHospitals.map((hospital) => (
                  <li key={hospital.id}>
                    <button
                      onClick={() => handleSelectHospital(hospital)}
                      className="w-full text-left px-4 py-3 bg-transparent border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-none w-9 h-9 grid place-items-center rounded-lg bg-[#eaf4ff] text-[#0066cc]">
                          <Icon name="hospital" size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-slate-800 font-manrope font-bold text-[13px] leading-snug truncate">
                            {hospital.name}
                          </h3>
                          <p className="mt-0.5 text-slate-500 text-[11.5px] leading-snug line-clamp-1">
                            {hospital.address}
                          </p>
                        </div>
                        <span className="flex-none text-[#0066cc] text-[11px] font-bold">
                          {(hospital.distance_meters / 1000).toFixed(1)} km
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          

          {/* TOMBOL KEMBALI DI BAWAH BOTTOM SHEET (MOBILE) */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[13px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}