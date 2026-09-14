import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <img src="/logo.jpg" alt="TravelAI Logo" style={{height: '32px', width: '32px', borderRadius: '4px'}} />
        TravelAI
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">🏠 Dashboard</NavLink>
        <NavLink to="/plan-tour" className="sidebar-link">🗺️ Plan Tour</NavLink>
        <NavLink to="/explore" className="sidebar-link">🌎 Explore</NavLink>
        <NavLink to="/favorites" className="sidebar-link">❤️ Favorites</NavLink>
        <NavLink to="/my-trips" className="sidebar-link">🧳 My Trips</NavLink>
        <NavLink to="/booking-history" className="sidebar-link">📖 Booking History</NavLink>
        <NavLink to="/profile" className="sidebar-link">👤 Profile</NavLink>
        <div className="sidebar-divider"></div>
        <NavLink to="/settings" className="sidebar-link">⚙️ Settings</NavLink>
      </nav>
    </aside>
  );
}
