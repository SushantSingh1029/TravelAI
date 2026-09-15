import { useState, useEffect } from 'react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';

const ExploredPlaceCard = ({ place }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageimages&titles=${encodeURIComponent(place.name)}&format=json&pithumbsize=500`);
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail?.source) {
            setImgUrl(pages[pageId].thumbnail.source);
          }
        }
      } catch (e) {
        console.error("Failed to fetch image for", place.name, e);
      }
    };
    fetchImage();
  }, [place.name]);

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '15px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        height: '200px', 
        backgroundColor: '#e2e8f0', 
        backgroundImage: imgUrl ? `url(${imgUrl})` : 'none', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8'
      }}>
        {!imgUrl && <span>No Image</span>}
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>{place.name}</h4>
        <div>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 'bold' }}>{place.category}</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>{place.description}</p>
      </div>
    </div>
  );
};

export default function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exploring, setExploring] = useState(false);
  const [exploredPlaces, setExploredPlaces] = useState([]);

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

  const handleExplore = async () => {
    setExploring(true);
    setExploredPlaces([]);
    try {
      const res = await api.get(`/api/destinations/explore-global?name=${encodeURIComponent(search)}`);
      setExploredPlaces(res.data.places);
    } catch (err) {
      console.error(err);
      alert("Failed to explore this destination. Please try again.");
    } finally {
      setExploring(false);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Explore Destinations</h1>
      
      <div style={{ marginBottom: '30px', maxWidth: '400px' }}>
        <AsyncSelect
          cacheOptions
          defaultOptions={destinations.map(d => ({ value: d.name, label: `${d.name}, ${d.country}`, isSeeded: true }))}
          loadOptions={async (inputValue) => {
            if (!inputValue) return destinations.map(d => ({ value: d.name, label: `${d.name}, ${d.country}`, isSeeded: true }));
            
            const seededMatches = destinations
              .filter(d => d.name.toLowerCase().includes(inputValue.toLowerCase()) || d.country.toLowerCase().includes(inputValue.toLowerCase()))
              .map(d => ({ value: d.name, label: `${d.name}, ${d.country} (Featured)`, isSeeded: true }));

            if (inputValue.length < 3) return seededMatches;

            try {
              const response = await api.get(`/api/destinations/search-global?q=${inputValue}`);
              const data = response.data;
              const globalMatches = data.map(item => ({
                value: item.display_name,
                label: item.display_name,
                isSeeded: false
              }));
              return [...seededMatches, ...globalMatches];
            } catch (e) {
              return seededMatches;
            }
          }}
          value={search ? { value: search, label: search } : null}
          onChange={(selectedOption) => setSearch(selectedOption ? selectedOption.value : '')}
          placeholder="Search any city in the world..."
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
        <>
          {filteredDestinations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {filteredDestinations.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : search ? (
            <div style={{ padding: '20px 0' }}>
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: '15px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>🌍 Ready to explore {search.split(',')[0]}?</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>We don't have a curated guide for this destination yet, but our AI can build you a fully custom itinerary instantly!</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '15px 30px', fontSize: '1.1rem' }}
                    onClick={handleExplore}
                    disabled={exploring}
                  >
                    {exploring ? "🔍 Discovering..." : `🔍 Discover Top Places in ${search.split(',')[0]}`}
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '15px 30px', fontSize: '1.1rem' }}
                    onClick={() => navigate('/plan-tour', { state: { globalDestination: search } })}
                  >
                    ✨ Plan a trip to {search.split(',')[0]}
                  </button>
                </div>
              </div>

              {exploredPlaces.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Top Tourist Attractions in {search.split(',')[0]}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {exploredPlaces.map((place, idx) => (
                      <ExploredPlaceCard key={idx} place={place} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>No destinations found.</p>
          )}
        </>
      )}
    </div>
  );
}
