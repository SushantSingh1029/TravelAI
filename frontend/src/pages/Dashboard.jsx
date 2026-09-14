import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../components/itinerary/Itinerary.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trips: 0, bookings: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tripsRes, bookingsRes, favRes] = await Promise.all([
          api.get('/api/trips'),
          api.get('/api/bookings'),
          api.get('/api/favorites')
        ]);
        setStats({
          trips: tripsRes.data.length,
          bookings: bookingsRes.data.length,
          favorites: favRes.data.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Ready to plan your next adventure?</p>
      </div>

      {loading ? (
        <div className="skeleton-pulse" style={{height: '200px', background: '#e2e8f0', borderRadius: '12px'}}></div>
      ) : (
        <>
          <div className="bookings-grid" style={{marginBottom: '30px'}}>
            <div className="booking-card" style={{alignItems: 'center', textAlign: 'center'}}>
              <h2 style={{fontSize: '3rem', margin: '10px 0', color: 'var(--primary)'}}>{stats.trips}</h2>
              <p style={{color: '#64748b', fontWeight: 500}}>Planned Trips</p>
            </div>
            <div className="booking-card" style={{alignItems: 'center', textAlign: 'center'}}>
              <h2 style={{fontSize: '3rem', margin: '10px 0', color: '#10b981'}}>{stats.bookings}</h2>
              <p style={{color: '#64748b', fontWeight: 500}}>Confirmed Bookings</p>
            </div>
            <div className="booking-card" style={{alignItems: 'center', textAlign: 'center'}}>
              <h2 style={{fontSize: '3rem', margin: '10px 0', color: '#ef4444'}}>{stats.favorites}</h2>
              <p style={{color: '#64748b', fontWeight: 500}}>Saved Places</p>
            </div>
          </div>

          <h2>Quick Actions</h2>
          <div className="bookings-grid" style={{marginTop: '15px'}}>
            <div className="booking-card" style={{cursor: 'pointer'}} onClick={() => navigate('/plan-tour')}>
              <h3 style={{margin: '0 0 10px 0'}}>✨ Create a New Trip</h3>
              <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '15px'}}>Let our AI build the perfect custom itinerary for your next destination.</p>
              <button className="btn-primary highlight" style={{width: '100%'}}>Plan Tour</button>
            </div>
            
            <div className="booking-card" style={{cursor: 'pointer'}} onClick={() => navigate('/explore')}>
              <h3 style={{margin: '0 0 10px 0'}}>🌍 Explore Destinations</h3>
              <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '15px'}}>Discover popular cities, beautiful beaches, and historical landmarks.</p>
              <button className="btn-secondary" style={{width: '100%'}}>Explore</button>
            </div>
          </div>

          <div style={{marginTop: '50px', borderTop: '1px solid #e2e8f0', paddingTop: '20px'}}>
            <button 
              onClick={handleLogout} 
              style={{ padding: '10px 20px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
            >
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
