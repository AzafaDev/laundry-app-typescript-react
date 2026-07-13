import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet's default marker icon resolves its image paths relative to the
// package itself, which breaks once bundled by Vite. Point it at the
// bundled asset URLs explicitly instead.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Center of the same Indonesia bounding box already used to bias OpenCage
// search results (see src/api/geocode.ts), so this isn't a second
// independently-chosen "center of Indonesia" constant.
const DEFAULT_CENTER: [number, number] = [-2.5, 117.5];
const DEFAULT_ZOOM = 5;
const SELECTED_ZOOM = 15;

export interface AddressMapValue {
  latitude?: number;
  longitude?: number;
}

interface AddressMapProps {
  value: AddressMapValue;
  onChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ latitude, longitude }: { latitude?: number; longitude?: number }) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      map.setView([latitude, longitude], SELECTED_ZOOM);
    }
  }, [latitude, longitude, map]);

  return null;
}

export function AddressMap({ value, onChange }: AddressMapProps) {
  const hasPosition = value.latitude !== undefined && value.longitude !== undefined;
  const initialCenter: [number, number] = hasPosition
    ? [value.latitude!, value.longitude!]
    : DEFAULT_CENTER;

  return (
    <div className="address-map-field">
      <div className="address-map">
        <MapContainer
          center={initialCenter}
          zoom={hasPosition ? SELECTED_ZOOM : DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          <Recenter latitude={value.latitude} longitude={value.longitude} />
          {hasPosition && (
            <Marker
              position={[value.latitude!, value.longitude!]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target as L.Marker;
                  const { lat, lng } = marker.getLatLng();
                  onChange(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <span className="address-map-hint">Klik atau geser pin di peta untuk koreksi lokasi</span>
    </div>
  );
}
