import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FavoritesContext } from '../context/FavoritesContext';

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await api.get(`/api/places/${id}`);
        setPlace(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;
  if (!place) return <div style={{ padding: '40px' }}>Place not found.</div>;

  const isFavorite = favorites.includes(place.id);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem', fontWeight: '600', padding: 0 }}>
        ← Back
      </button>
      
      <div style={{ borderRadius: '20px', overflow: 'hidden', height: '400px', marginBottom: '30px', boxShadow: 'var(--shadow-md)' }}>
        <img src={place.image_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{place.name}</h1>
          <span style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '20px' }}>
            {place.category}
          </span>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
            {place.description}
          </p>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {place.tags.map(tag => (
              <span key={tag} style={{ background: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-main)', border: '1px solid var(--border)' }}>#{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '350px', background: 'var(--surface)', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Rating</span>
            <span style={{ fontWeight: '700', color: 'var(--accent)' }}>⭐ {place.rating} / 5.0</span>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cost</span>
            <span style={{ fontWeight: '600' }}>${place.estimated_cost}</span>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Duration</span>
            <span style={{ fontWeight: '600' }}>{place.recommended_duration_minutes} min</span>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Best Time to Visit</span>
            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{place.best_time}</span>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginBottom: '15px', display: 'block' }} onClick={() => alert('Added to Trip!')}>
            ➕ Add to Trip
          </button>
          <button 
            style={{ 
              width: '100%', padding: '12px', 
              background: isFavorite ? '#ffebeb' : 'transparent', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', fontWeight: '600', 
              cursor: 'pointer', transition: 'all 0.2s' 
            }} 
            onClick={() => toggleFavorite(place.id)}
          >
            {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
}
