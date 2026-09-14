import { useEffect } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

export default function TripRoute({ positions }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [positions, map]);

  if (!positions || positions.length < 2) return null;

  return (
    <Polyline 
      positions={positions} 
      pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '8, 8' }} 
    />
  );
}
