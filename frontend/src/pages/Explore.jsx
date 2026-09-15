import { useState, useEffect } from 'react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';
import Select from 'react-select';

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
      
      <div style={{ marginBottom: '30px', maxWidth: '400px' }}>
        <Select
          options={destinations.map(d => ({ value: d.name, label: `${d.name}, ${d.country}` }))}
          value={search ? { value: search, label: search } : null}
          onChange={(selectedOption) => setSearch(selectedOption ? selectedOption.value : '')}
          placeholder="Search by name or country..."
          isSearchable={true}
          isClearable={true}
          styles={{
            control: (base) => ({
              ...base,
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '1rem',
              '&:hover': { border: '1px solid #aaa' }
            })
          }}
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
