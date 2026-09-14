import { useState, useEffect } from 'react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';

export default function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/api/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error("Failed to fetch destinations");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Explore Destinations</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by name or country..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '12px 20px', borderRadius: '30px', border: '1px solid #ccc', fontSize: '1rem', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
        />
      </div>

      {loading ? (
        <p>Loading destinations...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {filteredDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
