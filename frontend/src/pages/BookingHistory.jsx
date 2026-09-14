import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../components/itinerary/Itinerary.css';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="page-loading">Loading booking history...</div>;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <h1>Booking History</h1>
        <p>Review your confirmed itineraries and reference numbers.</p>
      </div>

      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>You haven't booked any trips yet.</p>
            <button className="btn-primary" onClick={() => navigate('/plan-tour')}>Plan a Tour</button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.destination}</h3>
                  <span className="status-badge success">{booking.status}</span>
                </div>
                <div className="booking-body">
                  <div className="booking-detail">
                    <span className="label">Reference:</span>
                    <span className="value font-mono font-bold">{booking.booking_reference}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Date:</span>
                    <span className="value">{booking.date || 'TBD'}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Travellers:</span>
                    <span className="value">{booking.travellers || 1}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Total Amount:</span>
                    <span className="value">${booking.total_amount}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="label">Booked On:</span>
                    <span className="value">{new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="booking-footer" style={{marginTop: '15px'}}>
                  <button className="btn-secondary" style={{width: '100%'}} onClick={() => navigate(`/plan-tour?trip=${booking.trip_id}`)}>View Itinerary</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
