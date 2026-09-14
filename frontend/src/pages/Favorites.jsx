import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import PlaceCard from '../components/PlaceCard';
import { FavoritesContext } from '../context/FavoritesContext';

export default function Favorites() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await api.get('/api/favorites');
        setPlaces(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [favorites.length]); 

  if (loading) return <div style={{ padding: '40px' }}>Loading your favorites...</div>;
  
  const displayPlaces = places.filter(p => favorites.includes(p.id));

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>My Favorite Places ❤️</h1>
      
      {displayPlaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
          <h2>No favorites yet!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Explore destinations and click the heart icon to save places here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {displayPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
