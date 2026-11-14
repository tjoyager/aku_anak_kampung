import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ArrowLeft,
  Phone,
  Navigation,
  MapPin,
  Compass,
  AlertTriangle,
  LocateFixed,
  ExternalLink,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Leaflet: Fix default icon loading for bundlers                            */
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

/* -------------------------------------------------------------------------- */
/*  Custom Distinct Icons for User vs Hospital                                */
/* -------------------------------------------------------------------------- */
const userMarkerIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div style="
    width: 22px; height: 22px;
    background: #10b981;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4), 0 4px 10px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11],
});

const hospitalMarkerIcon = L.divIcon({
  className: "custom-hospital-marker",
  html: `<div style="
    width: 32px; height: 32px;
    background: #dc2626;
    border: 2px solid #ffffff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
    display: flex; align-items: center; justify-content: center;
  ">
    <span style="
      transform: rotate(45deg);
      color: #ffffff;
      font-size: 16px;
      font-weight: 900;
      font-family: sans-serif;
      margin-top: -2px;
      margin-left: -2px;
    ">+</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

/* -------------------------------------------------------------------------- */
/*  Map Recenter Controller                                                   */
/* -------------------------------------------------------------------------- */
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Distance Calculation (Haversine Formula)                                  */
/* -------------------------------------------------------------------------- */
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/* -------------------------------------------------------------------------- */
/*  Dummy Hospitals Data (Surabaya Region)                                    */
/* -------------------------------------------------------------------------- */
interface HospitalItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  emergency: string;
  badge: string;
}

const SURABAYA_FALLBACK: [number, number] = [-7.250445, 112.768845];

const HOSPITALS: HospitalItem[] = [
  {
    id: "rsud-soetomo",
    name: "RSUD Dr. Soetomo",
    address:
      "Jl. Mayjen Prof. Dr. Moestopo No. 6-8, Airlangga, Kec. Gubeng, Kota Surabaya, Jawa Timur 60286",
    phone: "(031) 5501078",
    emergency: "119 / (031) 5501078",
    lat: -7.2684,
    lng: 112.7583,
    badge: "Rujukan Utama Nasional & IGD 24 Jam",
  },
  {
    id: "rs-unair",
    name: "Rumah Sakit Universitas Airlangga (RS Unair)",
    address:
      "Kampus C Unair, Jl. Mulyorejo, Mulyorejo, Kec. Mulyorejo, Kota Surabaya, Jawa Timur 60115",
    phone: "(031) 5916290",
    emergency: "(031) 5916290",
    lat: -7.2709,
    lng: 112.7845,
    badge: "Rumah Sakit Pendidikan & IGD Terpadu",
  },
  {
    id: "rs-premier",
    name: "RS Premier Surabaya",
    address:
      "Jl. Nginden Intan Barat Blok B, Nginden Jangkungan, Kec. Sukolilo, Kota Surabaya, Jawa Timur 60118",
    phone: "(031) 5993211",
    emergency: "(031) 5993211",
    lat: -7.2941,
    lng: 112.7682,
    badge: "Trauma Center & Stroke Unit 24 Jam",
  },
];

/* -------------------------------------------------------------------------- */
/*  Main Component: RumahSakit (Split View Map + Accessible Text List)       */
/* -------------------------------------------------------------------------- */
export function RumahSakit({ go }: { go?: (view: any) => void }) {
  const [userLocation, setUserLocation] = useState<[number, number]>(SURABAYA_FALLBACK);
  const [isUsingLiveGps, setIsUsingLiveGps] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeCenter, setActiveCenter] = useState<[number, number]>(SURABAYA_FALLBACK);

  // Get User's real position or fallback to Surabaya
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Perangkat tidak mendukung geolokasi GPS.");
      setUserLocation(SURABAYA_FALLBACK);
      setActiveCenter(SURABAYA_FALLBACK);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setActiveCenter(coords);
        setIsUsingLiveGps(true);
        setGeoError(null);
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? "Izin lokasi ditolak. Menampilkan titik pusat Surabaya."
            : "Gagal mendeteksi lokasi GPS. Menampilkan titik pusat Surabaya."
        );
        setUserLocation(SURABAYA_FALLBACK);
        setActiveCenter(SURABAYA_FALLBACK);
        setIsUsingLiveGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const openDirections = (hosp: HospitalItem) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${hosp.lat},${hosp.lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleBackToDashboard = () => {
    if (go) {
      go("dashboard");
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ================= HEADER ================= */}
      <header className="flex-none bg-white border-b border-slate-200 z-10 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs sm:text-sm font-semibold"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Dashboard</span>
            </button>

            <div>
              <h1 className="font-bold text-sm sm:text-base text-slate-900">
                Peta Fasilitas Kesehatan Terdekat
              </h1>
              <p className="text-[11px] text-slate-500">
                {isUsingLiveGps
                  ? "📍 Lokasi Anda Terdeteksi (GPS Aktif)"
                  : "📍 Lokasi Default: Surabaya, Jawa Timur"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchLocation}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-[#0066cc] hover:bg-blue-100 text-xs font-semibold transition-colors"
            title="Perbarui Lokasi GPS"
          >
            <LocateFixed size={14} />
            <span className="hidden sm:inline">Perbarui Lokasi</span>
          </button>
        </div>
      </header>

      {geoError && (
        <div className="flex-none bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-amber-800 text-xs text-center flex items-center justify-center gap-1.5">
          <AlertTriangle size={14} className="text-amber-600" />
          <span>{geoError}</span>
        </div>
      )}

      {/* ================= SPLIT VIEW ================= */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* 1. BAGIAN ATAS: PETA INTERAKTIF REACT LEAFLET */}
        <section
          aria-label="Peta Interaktif Rumah Sakit"
          className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
        >
          <MapContainer
            center={userLocation}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter center={activeCenter} />

            {/* Marker Lokasi Pengguna */}
            <Marker position={userLocation} icon={userMarkerIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="block text-emerald-700 font-bold mb-1">
                    🟢 Lokasi Anda Saat Ini
                  </strong>
                  <p className="text-slate-600 m-0">
                    Koordinat: {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {isUsingLiveGps ? "Akurasi GPS Perangkat" : "Titik Pusat Surabaya (Fallback)"}
                  </span>
                </div>
              </Popup>
            </Marker>

            {/* Marker 3 Rumah Sakit */}
            {HOSPITALS.map((hosp) => {
              const dist = calculateDistanceKm(
                userLocation[0],
                userLocation[1],
                hosp.lat,
                hosp.lng
              );
              return (
                <Marker
                  key={hosp.id}
                  position={[hosp.lat, hosp.lng]}
                  icon={hospitalMarkerIcon}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px] text-xs">
                      <strong className="block text-[#082d58] font-bold text-sm mb-1">
                        {hosp.name}
                      </strong>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px] mb-2">
                        Jarak: ~{dist} km
                      </span>
                      <p className="text-slate-600 mb-2 leading-tight">{hosp.address}</p>
                      <p className="text-slate-800 font-semibold mb-2">
                        📞 Telepon: {hosp.phone}
                      </p>
                      <button
                        onClick={() => openDirections(hosp)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-[#0066cc] text-white rounded font-bold text-xs hover:bg-[#0052a3]"
                      >
                        <Navigation size={13} />
                        Petunjuk Arah Google Maps
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
              <span className="font-medium text-slate-700">Lokasi Anda</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-xs"></span>
              <span className="font-medium text-slate-700">Rumah Sakit Terdekat</span>
            </div>
          </div>
        </section>

        {/* 2. BAGIAN BAWAH: DAFTAR TEKS RUMAH SAKIT (AKSESIBILITAS WCAG) */}
        <section
          role="region"
          aria-label="Daftar Fasilitas Kesehatan Terdekat untuk Aksesibilitas"
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#082d58] font-manrope">
                Daftar Faskes Sekitar ({HOSPITALS.length} Rumah Sakit Siaga)
              </h2>
              <p className="text-xs text-slate-500">
                Format teks terstruktur untuk memudahkan pengguna pembaca layar (screen reader)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOSPITALS.map((hosp) => {
              const distanceKm = calculateDistanceKm(
                userLocation[0],
                userLocation[1],
                hosp.lat,
                hosp.lng
              );

              return (
                <article
                  key={hosp.id}
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066cc] font-bold text-xs flex items-center gap-1">
                        <Compass size={12} />
                        {distanceKm} km dari Anda
                      </span>
                      <button
                        onClick={() => setActiveCenter([hosp.lat, hosp.lng])}
                        className="text-[11px] text-slate-400 hover:text-[#0066cc] font-semibold flex items-center gap-1 transition-colors"
                        title="Tampilkan di peta"
                      >
                        Pusatkan Peta
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                      {hosp.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-700 mb-3">
                      {hosp.badge}
                    </p>

                    <div className="space-y-2 text-xs text-slate-600 mb-4">
                      <p className="flex items-start gap-1.5 leading-relaxed">
                        <MapPin size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{hosp.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Phone size={14} className="text-slate-400 flex-shrink-0" />
                        <span>Telepon: {hosp.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                    <a
                      href={`tel:${hosp.phone.replace(/[^0-9]/g, "")}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
                      aria-label={`Telepon ${hosp.name}`}
                    >
                      <Phone size={14} />
                      <span>Telepon</span>
                    </a>

                    <button
                      onClick={() => openDirections(hosp)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-xs transition-colors shadow-xs"
                      aria-label={`Buka rute Google Maps ke ${hosp.name}`}
                    >
                      <Navigation size={14} />
                      <span>Arahkan</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Tombol Kembali Bawah */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-center">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-sm shadow-xs transition-all"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Export compatibility for older components importing NearbyHospitalsMap    */
/* -------------------------------------------------------------------------- */
export default function NearbyHospitalsMap(props?: any) {
  return <RumahSakit go={props?.onBack} />;
}
