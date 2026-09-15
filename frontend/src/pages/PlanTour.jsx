import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { FavoritesContext } from '../context/FavoritesContext';
import Itinerary from '../components/itinerary/Itinerary';
import { useLocation } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import './PlanTour.css';

const TRAVEL_STYLES = ['Budget', 'Relaxed', 'Balanced', 'Adventure', 'Luxury'];
const INTERESTS = ['Beaches', 'Nature', 'Adventure', 'Food', 'Shopping', 'Culture', 'Photography', 'Nightlife', 'History', 'Relaxation'];

export default function PlanTour() {
  const [step, setStep] = useState(1);
  const { favorites } = useContext(FavoritesContext);
  
  const [destinations, setDestinations] = useState([]);
  const [destinationPlaces, setDestinationPlaces] = useState([]);
  
  const [generating, setGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    destinationId: '',
    destinationName: location.state?.globalDestination || '',
    days: 3,
    budget: '',
    travellers: 2,
    dates: '',
    travelStyle: 'Balanced',
    interests: [],
    selectedPlaces: []
  });

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const res = await api.get('/api/destinations');
        setDestinations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDest();
  }, []);

  useEffect(() => {
    if (formData.destinationId) {
      const fetchPlaces = async () => {
        try {
          const res = await api.get(`/api/destinations/${formData.destinationId}/places`);
          setDestinationPlaces(res.data);
          
          const favsInDest = res.data.filter(p => favorites.includes(p.id)).map(p => p.id);
          setFormData(prev => ({ ...prev, selectedPlaces: favsInDest }));
        } catch (err) {
          console.error(err);
        }
      };
      fetchPlaces();
    }
  }, [formData.destinationId, favorites]);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const togglePlace = (placeId) => {
    setFormData(prev => ({
      ...prev,
      selectedPlaces: prev.selectedPlaces.includes(placeId)
        ? prev.selectedPlaces.filter(id => id !== placeId)
        : [...prev.selectedPlaces, placeId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // 1. Create Trip
      const tripPayload = {
        days: parseInt(formData.days),
        budget: formData.budget || "Unspecified",
        travellers: parseInt(formData.travellers),
        start_date: formData.dates || null,
        preferences: {
          travelStyle: formData.travelStyle,
          interests: formData.interests
        },
        favorite_place_ids: formData.selectedPlaces
      };

      if (formData.destinationId) {
        tripPayload.destination_id = formData.destinationId;
      } else if (formData.destinationName) {
        tripPayload.destination_name = formData.destinationName;
      }

      const tripRes = await api.post('/api/trips', tripPayload);
      
      const tripId = tripRes.id || tripRes.data.id;
      
      // 2. Generate Itinerary
      const genRes = await api.post(`/api/trips/${tripId}/generate-itinerary`);
      
      setGeneratedTrip(genRes.data);
      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (step === 4 && generatedTrip) {
    return (
      <div className="fade-in">
        <Itinerary trip={generatedTrip} itinerary={generatedTrip.itinerary} />
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn-primary" onClick={() => setStep(1)}>Plan Another Trip</button>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-tour-container">
      <div className="plan-header">
        <h1>Design Your Perfect Trip ✈️</h1>
        <div className="progress-bar">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Basics</div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Preferences</div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Places</div>
        </div>
      </div>

      <div className="plan-card">
        {step === 1 && (
          <div className="form-step">
            <h2>Where do you want to go?</h2>
            
            <div className="form-group">
              <label>Destination</label>
              <AsyncSelect
                cacheOptions
                defaultOptions={destinations.map(d => ({ value: d.id, label: `${d.name}, ${d.country}`, isSeeded: true }))}
                loadOptions={async (inputValue) => {
                  if (!inputValue) return destinations.map(d => ({ value: d.id, label: `${d.name}, ${d.country}`, isSeeded: true }));
                  
                  const seededMatches = destinations
                    .filter(d => d.name.toLowerCase().includes(inputValue.toLowerCase()) || d.country.toLowerCase().includes(inputValue.toLowerCase()))
                    .map(d => ({ value: d.id, label: `${d.name}, ${d.country} (Featured)`, isSeeded: true }));

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
                value={
                  formData.destinationId 
                    ? { value: formData.destinationId, label: destinations.find(d => d.id === formData.destinationId)?.name || 'Unknown' }
                    : formData.destinationName 
                      ? { value: formData.destinationName, label: formData.destinationName }
                      : null
                }
                onChange={(selectedOption) => {
                  if (!selectedOption) {
                    setFormData({...formData, destinationId: '', destinationName: ''});
                  } else if (selectedOption.isSeeded) {
                    setFormData({...formData, destinationId: selectedOption.value, destinationName: ''});
                  } else {
                    setFormData({...formData, destinationId: '', destinationName: selectedOption.value});
                  }
                }}
                placeholder="Search any city in the world..."
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: '6px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    boxShadow: 'none',
                    '&:hover': { border: '1px solid #aaa' }
                  })
                }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>How many days?</label>
                <input type="number" min="1" max="30" value={formData.days} onChange={(e) => setFormData({...formData, days: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Number of Travellers</label>
                <input type="number" min="1" max="20" value={formData.travellers} onChange={(e) => setFormData({...formData, travellers: e.target.value})} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget (e.g. $2000 or ₹50,000)</label>
                <input type="text" placeholder="Estimated budget" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Dates (Optional)</label>
                <input type="date" value={formData.dates} onChange={(e) => setFormData({...formData, dates: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>What's your travel style?</h2>
            
            <div className="style-grid">
              {TRAVEL_STYLES.map(style => (
                <div 
                  key={style} 
                  className={`style-card ${formData.travelStyle === style ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, travelStyle: style})}
                >
                  {style}
                </div>
              ))}
            </div>

            <h2 style={{marginTop: '40px'}}>What are your interests?</h2>
            <div className="interest-tags">
              {INTERESTS.map(interest => (
                <button 
                  key={interest}
                  className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Select your must-visit places</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>We've automatically pre-selected places you previously favorited.</p>
            
            <div className="places-selection-grid">
              {destinationPlaces.length === 0 ? (
                <p>No places found for this destination.</p>
              ) : (
                destinationPlaces.map(place => (
                  <div 
                    key={place.id}
                    className={`mini-place-card ${formData.selectedPlaces.includes(place.id) ? 'selected' : ''}`}
                    onClick={() => togglePlace(place.id)}
                  >
                    <img src={place.image_url} alt={place.name} />
                    <div className="mini-place-info">
                      <h4>{place.name}</h4>
                      <span>{place.category}</span>
                    </div>
                    {formData.selectedPlaces.includes(place.id) && <div className="check-icon">✓</div>}
                  </div>
                ))
              )}
            </div>
            
            <div className="summary-box">
              <h3>Trip Summary</h3>
              <p><strong>Destination:</strong> {formData.destinationId ? (destinations.find(d => d.id === formData.destinationId)?.name || 'Unknown') : formData.destinationName}</p>
              <p><strong>Duration:</strong> {formData.days} days | <strong>Travellers:</strong> {formData.travellers}</p>
              <p><strong>Budget:</strong> {formData.budget || 'Not specified'}</p>
              <p><strong>Style:</strong> {formData.travelStyle}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 ? (
            <button className="btn-secondary" onClick={handlePrev} disabled={generating}>← Back</button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext} disabled={step === 1 && !formData.destinationId && !formData.destinationName}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary generate-btn" onClick={handleSubmit} disabled={generating}>
              {generating ? "✨ Generating..." : "✨ Generate AI Itinerary"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
