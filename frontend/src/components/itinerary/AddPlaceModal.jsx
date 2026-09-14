import { useState, useEffect } from 'react';
import api from '../../services/api';
import './Itinerary.css';

export default function AddPlaceModal({ destinationId, onClose, onAddPlace }) {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await api.get(`/api/destinations/${destinationId}/places`);
        setPlaces(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (destinationId) fetchPlaces();
  }, [destinationId]);

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-place-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a Place</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <input 
          type="text" 
          placeholder="Search places by name or category..." 
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        
        <div className="places-list">
          {loading ? (
            <p>Loading places...</p>
          ) : filteredPlaces.length === 0 ? (
            <p>No places found.</p>
          ) : (
            filteredPlaces.map(place => (
              <div key={place.id} className="place-result-card">
                <img src={place.image_url} alt={place.name} className="place-img" />
                <div className="place-details">
                  <h4>{place.name}</h4>
                  <p className="place-cat">{place.category} • ⭐ {place.rating}</p>
                  <p className="place-meta">
                    Est. Cost: ${place.estimated_cost} | Duration: {place.recommended_duration}
                  </p>
                </div>
                <button 
                  className="btn-primary add-btn"
                  onClick={() => {
                    onAddPlace(place);
                    onClose();
                  }}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
