import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PlaceCard from '../components/PlaceCard';

export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, placesRes] = await Promise.all([
          api.get(`/api/destinations/${id}`),
          api.get(`/api/destinations/${id}/places`)
        ]);
        setDestination(destRes.data);
        setPlaces(placesRes.data);
      } catch (err) {
        console.error("Error fetching destination details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!destination) return <div>Destination not found.</div>;

  const categories = ['All', ...new Set(places.map(p => p.category))];
  
  const filteredPlaces = places.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ margin: '-40px' }}>
      <div style={{ position: 'relative', height: '400px' }}>
        <img src={destination.image_url} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '40px' }}>
          <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{destination.name}</h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{destination.country}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px', color: 'var(--text-muted)' }}>{destination.description}</p>
        
        <h2 style={{ marginBottom: '20px' }}>Top Places to Visit</h2>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search places..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #ccc', minWidth: '250px', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: categoryFilter === cat ? 'var(--primary)' : 'var(--bg-color)',
                  color: categoryFilter === cat ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
          {filteredPlaces.length === 0 && <p>No places found matching your filters.</p>}
        </div>
      </div>
    </div>
  );
}
