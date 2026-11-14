import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ArrowLeft,
  Hospital as HospitalIcon,
  Phone,
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  LocateFixed,
  ExternalLink,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Surabaya Fallback Coordinates                                             */
/* -------------------------------------------------------------------------- */
const SURABAYA_FALLBACK: [number, number] = [-7.250445, 112.768845];

/* -------------------------------------------------------------------------- */
/*  Custom Leaflet Marker Icons                                               */
/* -------------------------------------------------------------------------- */
const userMarkerIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #0066cc;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 6px rgba(0, 102, 204, 0.25), 0 4px 10px rgba(0,0,0,0.25);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

const hospitalMarkerIcon = L.divIcon({
  className: "custom-hospital-marker",
  html: `<div style="
    width: 36px;
    height: 36px;
    background: #dc2626;
    border: 3px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="
      transform: rotate(45deg);
      color: #ffffff;
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
    ">+</div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const hospitalSelectedMarkerIcon = L.divIcon({
  className: "custom-hospital-selected-marker",
  html: `<div style="
    width: 42px;
    height: 42px;
    background: #0066cc;
    border: 3px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="
      transform: rotate(45deg);
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      line-height: 1;
    ">+</div>
  </div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});

/* -------------------------------------------------------------------------- */
/*  3 Dummy Hospitals                                                         */
/* -------------------------------------------------------------------------- */
interface DummyHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  coords: [number, number];
  distance: string;
  type: string;
  services: string[];
}

const DUMMY_HOSPITALS: DummyHospital[] = [
  {
    id: "rs-1",
    name: "RSUD Dr. Soetomo",
    address: "Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Surabaya",
    phone: "(031) 5501078",
    coords: [-7.2683, 112.7583],
    distance: "2.1 km",
    type: "RS Rujukan Utama Kelas A",
    services: ["IGD 24 Jam", "Trauma Center", "Ambulans Siaga", "ICU / ICCU"],
  },
  {
    id: "rs-2",
    name: "RS Siloam Surabaya",
    address: "Jl. Raya Gubeng No.70, Gubeng, Surabaya",
    phone: "(031) 99206900",
    coords: [-7.2764, 112.7485],
    distance: "3.4 km",
    type: "RS Swasta Terakreditasi Paripurna",
    services: ["IGD 24 Jam", "Stroke Unit", "Laboratorium 24 Jam", "Farmasi 24 Jam"],
  },
  {
    id: "rs-3",
    name: "RS Premier Surabaya",
    address: "Jl. Nginden Intan Barat Blok B, Sukolilo, Surabaya",
    phone: "(031) 5993211",
    coords: [-7.3005, 112.7656],
    distance: "5.8 km",
    type: "RS Standar Internasional JCI",
    services: ["IGD 24 Jam", "Kardiologi", "Bedah Darurat", "Ambulans ICU"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Map Controller Component                                                  */
/* -------------------------------------------------------------------------- */
function MapController({ center, zoom = 14 }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Main Component: RumahSakit                                                */
/* -------------------------------------------------------------------------- */
interface RumahSakitProps {
  go?: (view: any) => void;
  user?: any;
  onNotify?: (msg: string) => void;
  onBack?: () => void;
  [key: string]: any;
}

export function RumahSakit({ go, onBack }: RumahSakitProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>(SURABAYA_FALLBACK);
  const [activeCenter, setActiveCenter] = useState<[number, number]>(SURABAYA_FALLBACK);
  const [selectedHospital, setSelectedHospital] = useState<DummyHospital | null>(DUMMY_HOSPITALS[0]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setActiveCenter(coords);
          setIsUsingFallback(false);
        },
        (err) => {
          console.warn("Geolocation warning, using Surabaya fallback:", err.message);
          setUserLocation(SURABAYA_FALLBACK);
          setActiveCenter(SURABAYA_FALLBACK);
          setIsUsingFallback(true);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setUserLocation(SURABAYA_FALLBACK);
      setActiveCenter(SURABAYA_FALLBACK);
      setIsUsingFallback(true);
    }
  }, []);

  const handleBack = () => {
    if (go) {
      go("dashboard");
    } else if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleSelectHospital = (rs: DummyHospital) => {
    setSelectedHospital(rs);
    setActiveCenter(rs.coords);
  };

  const handleResetLocation = () => {
    setActiveCenter(userLocation);
  };

  const openGoogleMapsDirections = (rs: DummyHospital) => {
    const origin = `${userLocation[0]},${userLocation[1]}`;
    const destination = `${rs.coords[0]},${rs.coords[1]}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rumahsakit-page h-screen w-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#0066cc] text-white flex items-center justify-between shadow-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Kembali ke Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <HospitalIcon size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-tight">
                Rumah Sakit & Faskes Terdekat
              </h1>
              <span className="text-[11px] text-blue-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {isUsingFallback ? "Lokasi: Surabaya (Fallback)" : "GPS Lokasi Aktif"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            title="Pusatkan ke lokasi Anda"
          >
            <LocateFixed size={14} />
            <span className="hidden md:inline">Pusatkan Lokasi</span>
          </button>
          <a
            href="tel:119"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Phone size={13} />
            <span>IGD 119</span>
          </a>
        </div>
      </header>

      {/* Split-View Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* SIDEBAR: Daftar 3 Rumah Sakit */}
        <aside className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden order-2 md:order-1 h-1/2 md:h-full z-10 shadow-lg md:shadow-none">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0066cc]" />
                Daftar Rumah Sakit Terdekat
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                3 Fasilitas kesehatan dengan IGD 24 jam terverifikasi
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#0066cc]">
              {DUMMY_HOSPITALS.length} Faskes
            </span>
          </div>

          {/* List of 3 Hospitals */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {DUMMY_HOSPITALS.map((rs) => {
              const isSelected = selectedHospital?.id === rs.id;
              return (
                <div
                  key={rs.id}
                  onClick={() => handleSelectHospital(rs)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[#0066cc] bg-blue-50/50 shadow-md ring-2 ring-[#0066cc]/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-wider block">
                        {rs.type}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug mt-0.5">
                        {rs.name}
                      </h3>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-[#eaf4ff] text-[#0066cc]">
                      {rs.distance}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 flex items-start gap-1.5 leading-relaxed">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-slate-400" />
                    <span>{rs.address}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {rs.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1"
                      >
                        <Clock size={10} className="text-slate-400" />
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Actions for RS */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMapsDirections(rs);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Navigation size={13} />
                      <span>Petunjuk Arah</span>
                      <ExternalLink size={11} className="opacity-70" />
                    </button>
                    <a
                      href={`tel:${rs.phone.replace(/[^0-9]/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title={`Telepon IGD: ${rs.phone}`}
                    >
                      <Phone size={13} className="text-emerald-600" />
                      <span>Hubungi</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 shrink-0">
            Perlu penjemputan darurat? Hubungi nomor IGD faskes terkait atau 119.
          </div>
        </aside>

        {/* MAP VIEW: Leaflet Interactive Map */}
        <main className="flex-1 h-1/2 md:h-full relative order-1 md:order-2 bg-slate-100">
          <MapContainer
            center={userLocation}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={activeCenter} zoom={14} />

            {/* Marker Lokasi Pengguna */}
            <Marker position={userLocation} icon={userMarkerIcon}>
              <Popup>
                <div className="p-1 text-slate-800 font-sans">
                  <strong className="block text-sm text-[#0066cc]">Lokasi Anda</strong>
                  <span className="text-xs text-slate-600 mt-1 block">
                    {isUsingFallback
                      ? "Titik default Surabaya (Pusat Kota)"
                      : "Posisi GPS terdeteksi"}
                  </span>
                </div>
              </Popup>
            </Marker>

            {/* Markers 3 RS Dummy */}
            {DUMMY_HOSPITALS.map((rs) => {
              const isSelected = selectedHospital?.id === rs.id;
              return (
                <Marker
                  key={rs.id}
                  position={rs.coords}
                  icon={isSelected ? hospitalSelectedMarkerIcon : hospitalMarkerIcon}
                  eventHandlers={{
                    click: () => handleSelectHospital(rs),
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-slate-800 max-w-[220px]">
                      <span className="text-[10px] font-bold text-red-600 uppercase block">
                        IGD 24 Jam
                      </span>
                      <strong className="block text-sm font-bold text-slate-900 mt-0.5">
                        {rs.name}
                      </strong>
                      <p className="text-xs text-slate-600 mt-1">{rs.address}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0066cc]">{rs.distance}</span>
                        <a
                          href={`tel:${rs.phone.replace(/[^0-9]/g, "")}`}
                          className="text-xs font-bold text-red-600 underline"
                        >
                          {rs.phone}
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </main>
      </div>
    </div>
  );
}

export const NearbyHospitalsMap = RumahSakit;
export default RumahSakit;
