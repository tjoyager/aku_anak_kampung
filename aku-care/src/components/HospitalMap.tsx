import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon path yang terputus oleh bundler
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Placeholder data rumah sakit — bisa diganti dengan hasil fetch API
const hospitals = [
  { id: 1, name: "RSUD Dr. Soetomo", lat: -7.2695, lng: 112.7528, address: "Jl. Mayjen Prof. Dr. Moestopo 6-8, Surabaya", phone: "031-5501011" },
  { id: 2, name: "RS Premier Surabaya", lat: -7.2574, lng: 112.7378, address: "Jl. Nginden Semolo 1, Surabaya", phone: "031-5993111" },
  { id: 3, name: "RS Siloam Surabaya", lat: -7.2621, lng: 112.7318, address: "Jl. Raya Gubeng 70, Surabaya", phone: "031-5676888" },
  { id: 4, name: "RSIA Kendangsari MERR", lat: -7.3015, lng: 112.7701, address: "Jl. Kendangsari MERR 100, Surabaya", phone: "031-9926950" },
  { id: 5, name: "RS Bhayangkara Surabaya", lat: -7.2454, lng: 112.7362, address: "Jl. Ahmad Yani 116, Surabaya", phone: "031-8291926" },
];

interface HospitalMapProps {
  onClose: () => void;
}

export default function HospitalMap({ onClose }: HospitalMapProps) {
  // Pusat peta: Surabaya
  const center: [number, number] = [-7.2756, 112.7343];

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <section className="hospital-map-modal">
        <div className="phq9-header">
          <div>
            <span className="modal-kicker">LAYANAN KESEHATAN</span>
            <h2 id="hospital-map-title">Rumah Sakit Terdekat</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup peta rumah sakit">✕</button>
        </div>

        {/* Peta Leaflet */}
        <div className="hospital-map-container" aria-label="Peta lokasi rumah sakit terdekat">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "360px", width: "100%", borderRadius: "12px" }}
            aria-label="Peta interaktif rumah sakit"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lng]}>
                <Popup>
                  <strong>{h.name}</strong>
                  <br />
                  {h.address}
                  <br />
                  <a href={`tel:${h.phone.replace(/-/g, "")}`} aria-label={`Telepon ${h.name}`}>
                    📞 {h.phone}
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Daftar RS aksesibel */}
        <ul className="hospital-list" aria-label="Daftar rumah sakit terdekat">
          {hospitals.map((h) => (
            <li key={h.id} className="hospital-list-item">
              <div>
                <strong>{h.name}</strong>
                <small>{h.address}</small>
              </div>
              <a
                href={`tel:${h.phone.replace(/-/g, "")}`}
                className="hospital-call-btn"
                aria-label={`Hubungi ${h.name} di nomor ${h.phone}`}
              >
                📞 {h.phone}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
