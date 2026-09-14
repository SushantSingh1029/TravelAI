import './Itinerary.css';
import { useNavigate } from 'react-router-dom';

export default function BookingConfirmationModal({ booking, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal slide-up">
        <div className="success-icon">✅</div>
        <h2>Trip Confirmed!</h2>
        <p className="confirmation-disclaimer">
          Note: This is an internal itinerary confirmation. No real hotel, flight, or attraction reservations have been made.
        </p>
        
        <div className="booking-details-card">
          <div className="detail-row">
            <span>Reference Number:</span>
            <span className="ref-number">{booking.booking_reference}</span>
          </div>
          <div className="detail-row">
            <span>Destination:</span>
            <strong>{booking.destination}</strong>
          </div>
          <div className="detail-row">
            <span>Total Estimated Cost:</span>
            <strong>${booking.total_amount}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge success">{booking.status}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn-secondary" onClick={onClose}>Back to Itinerary</button>
          <button className="btn-primary" onClick={() => navigate('/booking-history')}>View Booking History</button>
        </div>
      </div>
    </div>
  );
}
