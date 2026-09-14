import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import './PlaceCard.css';

export default function PlaceCard({ place }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.includes(place.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(place.id);
  };

  const handleAddTrip = (e) => {
    e.preventDefault();
    alert(`Added ${place.name} to your Trip!`);
  };

  return (
    <Link to={`/places/${place.id}`} className="place-card">
      <div className="place-img-wrapper">
        <img src={place.image_url} alt={place.name} className="place-card-img" />
        <div className="place-actions">
          <button className="icon-btn favorite-btn" onClick={handleFavorite}>
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
      <div className="place-card-content">
        <div className="place-header">
          <h3>{place.name}</h3>
          <span className="place-rating">⭐ {place.rating}</span>
        </div>
        <p className="place-category">{place.category}</p>
        
        <div className="place-details-row">
          <span>⏱️ {place.recommended_duration_minutes} min</span>
          <span>💰 ${place.estimated_cost}</span>
        </div>
        
        <button className="btn-primary place-add-btn" onClick={handleAddTrip}>➕ Add to Trip</button>
      </div>
    </Link>
  );
}
