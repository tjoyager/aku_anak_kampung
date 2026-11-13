import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from './lib/supabase';

// Fix ikon default Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
}

function MapController({ center, zoom }: { center: [number, number] | null, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function NearbyHospitalsMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation tidak didukung oleh browser Anda.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);

        const { data, error } = await supabase.rpc('get_nearby_hospitals', {
          user_lat: latitude,
          user_lng: longitude,
          radius_meters: 50000, 
          max_results: 50, 
        });

        if (error) {
          console.error(error);
          setErrorMsg('Gagal mengambil data rumah sakit: ' + error.message);
        } else {
          setHospitals(data || []);
        }
        setLoading(false);
      },
      (error) => {
        setErrorMsg('Gagal mendapatkan lokasi Anda. Pastikan izin lokasi aktif. (' + error.message + ')');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setMapCenter([hospital.latitude, hospital.longitude]);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: '#f9fafb' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #0d9488', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginLeft: '16px', color: '#4b5563', fontWeight: 'bold' }}>Mencari lokasi dan rumah sakit terdekat...</p>
      </div>
    );
  }

  if (errorMsg) return <div style={{ padding: '24px', color: '#dc2626', backgroundColor: '#fef2f2', margin: '16px', borderRadius: '8px' }}>{errorMsg}</div>;
  if (!userLocation) return <div style={{ padding: '24px' }}>Lokasi tidak tersedia.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
      
      {/* SIDEBAR: List Rumah Sakit */}
      <div style={{ width: '35%', height: '100%', overflowY: 'auto', backgroundColor: 'white', borderRight: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px', backgroundColor: '#0d9488', color: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Fasilitas Kesehatan</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#ccfbf1' }}>Ditemukan {hospitals.length} RS dalam radius 50km</p>
        </div>

        {hospitals.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Tidak ada rumah sakit dalam radius 50km dari lokasi Anda.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {hospitals.map((hospital) => (
              <li 
                key={hospital.id} 
                onClick={() => handleSelectHospital(hospital)}
                style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid #f3f4f6', 
                  cursor: 'pointer',
                  backgroundColor: selectedHospital?.id === hospital.id ? '#f0fdfa' : 'transparent',
                  borderLeft: selectedHospital?.id === hospital.id ? '4px solid #0d9488' : '4px solid transparent'
                }}
              >
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1f2937' }}>{hospital.name}</h3>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>{hospital.address}</p>
                <span style={{ display: 'inline-block', backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' }}>
                  {(hospital.distance_meters / 1000).toFixed(2)} km
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MAP: Peta Leaflet */}
      <div style={{ width: '65%', height: '100%', position: 'relative', backgroundColor: '#e5e7eb' }}>
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} />

          <Marker position={userLocation}>
            <Popup><strong>Lokasi Anda Saat Ini</strong></Popup>
          </Marker>

          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              eventHandlers={{ click: () => setSelectedHospital(hospital) }}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ fontSize: '14px', color: '#0f766e' }}>{hospital.name}</strong>
                  <br />
                  <span style={{ fontSize: '12px', color: '#4b5563' }}>{hospital.address}</span>
                  <br />
                  <span style={{ display: 'inline-block', marginTop: '8px', fontWeight: 'bold', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                    {(hospital.distance_meters / 1000).toFixed(2)} km dari lokasi Anda
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}