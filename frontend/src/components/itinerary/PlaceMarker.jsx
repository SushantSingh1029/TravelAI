import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PlaceMarker({ activity }) {
  if (!activity.latitude || !activity.longitude) return null;

  return (
    <Marker position={[activity.latitude, activity.longitude]}>
      <Popup>
        <div className="custom-popup">
          <strong>{activity.activity_name}</strong>
          <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
            {activity.start_time} - {activity.end_time}
          </p>
          {activity.travel_time && (
            <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>
              🚗 {activity.travel_time}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
