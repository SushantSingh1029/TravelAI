import { MapContainer, TileLayer } from 'react-leaflet';
import PlaceMarker from './PlaceMarker';
import TripRoute from './TripRoute';
import './MapView.css';

export default function MapView({ activeDayData }) {
  // Extract all valid coordinates from the active day's activities
  const positions = activeDayData?.activities
    ?.filter(act => act.latitude && act.longitude)
    .map(act => [act.latitude, act.longitude]) || [];

  return (
    <div className="map-view-wrapper">
      <MapContainer 
        center={positions.length > 0 ? positions[0] : [0, 0]} 
        zoom={13} 
        scrollWheelZoom={true}
        className="itinerary-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render markers for all activities that have coordinates */}
        {activeDayData?.activities?.map((act, index) => (
          <PlaceMarker key={index} activity={act} />
        ))}
        
        {/* Render the connecting route lines and handle map auto-centering */}
        <TripRoute positions={positions} />
      </MapContainer>
    </div>
  );
}
