import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../components/itinerary/Itinerary.css';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'planning', 'completed'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/api/trips');
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return <div className="page-loading">Loading trips...</div>;

  const now = new Date();

  // Categorize trips
  const categorizedTrips = {
    planning: trips.filter(t => t.status !== 'booked'),
    upcoming: trips.filter(t => {
      if (t.status !== 'booked') return false;
      if (!t.end_date) return true; // fallback if no date
      return new Date(t.end_date) >= now;
    }),
    completed: trips.filter(t => {
      if (t.status !== 'booked') return false;
      if (!t.end_date) return false; // fallback if no date
      return new Date(t.end_date) < now;
    })
  };

  const displayedTrips = categorizedTrips[activeTab] || [];

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <h1>My Trips</h1>
        <p>Manage all your past, present, and future adventures.</p>
      </div>

      <div className="day-switcher" style={{marginTop: '20px', marginBottom: '30px', justifyContent: 'flex-start'}}>
        <button 
          className={`day-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({categorizedTrips.upcoming.length})
        </button>
        <button 
          className={`day-tab ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          Planning ({categorizedTrips.planning.length})
        </button>
        <button 
          className={`day-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({categorizedTrips.completed.length})
        </button>
      </div>

      <div className="bookings-list" style={{padding: 0}}>
        {displayedTrips.length === 0 ? (
          <div className="empty-state">
            <p>No trips found in this category.</p>
            {activeTab === 'planning' && (
              <button className="btn-primary" onClick={() => navigate('/plan-tour')}>Start Planning</button>
            )}
          </div>
        ) : (
          <div className="bookings-grid">
            {displayedTrips.map(trip => (
              <div key={trip.id} className="booking-card">
                <div className="booking-header">
                  <h3>{trip.itinerary?.destination || 'New Trip'}</h3>
                  <span className={`status-badge ${trip.status === 'booked' ? 'success' : 'pending'}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="booking-body">
                  <div className="booking-detail">
                    <span className="label">Travellers:</span>
                    <span className="value">{trip.travellers}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Days:</span>
                    <span className="value">{trip.days}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Budget:</span>
                    <span className="value">{trip.budget}</span>
                  </div>
                </div>
                <div className="booking-footer" style={{marginTop: '15px'}}>
                  <button className="btn-primary" style={{width: '100%'}} onClick={() => navigate(`/plan-tour?trip=${trip.id}`)}>
                    {activeTab === 'planning' ? 'Continue Planning' : 'View Itinerary'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
