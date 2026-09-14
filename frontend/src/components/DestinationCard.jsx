import { Link } from 'react-router-dom';
import './DestinationCard.css';

export default function DestinationCard({ destination }) {
  return (
    <Link to={`/explore/${destination.id}`} className="destination-card">
      <img src={destination.image_url} alt={destination.name} className="dest-card-img" />
      <div className="dest-card-content">
        <h3>{destination.name}</h3>
        <p className="dest-country">{destination.country}</p>
        <div className="dest-categories">
          {destination.categories.slice(0, 3).map(cat => (
            <span key={cat} className="dest-cat-badge">{cat}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
