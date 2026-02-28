import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MARKER_COLORS: Record<string, string> = {
  red: '#e53e3e',
  orange: '#dd6b20',
  yellow: '#d69e2e',
  blue: '#3182ce',
  green: '#38a169',
};

function createColoredIcon(color: string): L.DivIcon {
  const hex = MARKER_COLORS[color] ?? MARKER_COLORS.blue;
  return L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${hex}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });
}

interface MarkerProps {
  position?: { lat: number; lng: number };
  color?: string;
}

export const Marker: React.FC<MarkerProps> = ({ position, color }) => {
  if (!position) return null;

  const icon = color ? createColoredIcon(color) : defaultIcon;

  return <LeafletMarker position={[position.lat, position.lng]} icon={icon} />;
};
