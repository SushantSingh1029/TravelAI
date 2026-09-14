import { useState } from 'react';
import '../components/itinerary/Itinerary.css';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <h1>App Settings</h1>
        <p>Customize your TravelAI experience.</p>
      </div>

      <div className="profile-container" style={{maxWidth: '600px'}}>
        <div className="booking-card">
          <h3 style={{marginTop: 0, borderBottom: '1px solid var(--secondary)', paddingBottom: '10px'}}>Preferences</h3>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--secondary)'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontWeight: 500}}>Email Notifications</p>
              <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--text-light)'}}>Receive trip reminders and budget alerts.</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              style={{
                width: '50px', height: '26px', borderRadius: '13px', border: 'none',
                background: notifications ? 'var(--primary)' : '#cbd5e1',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
              }}
            >
              <div style={{
                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '3px', left: notifications ? '27px' : '3px', transition: 'left 0.3s'
              }}/>
            </button>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--secondary)'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontWeight: 500}}>App Theme</p>
              <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--text-light)'}}>Select the visual appearance of the app.</p>
            </div>
            <select 
              value={document.documentElement.getAttribute('data-theme') || 'light'}
              onChange={(e) => {
                const theme = e.target.value;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                setDarkMode(!darkMode); // just to force re-render
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: 'var(--surface)',
                color: 'var(--text-dark)',
                cursor: 'pointer'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="ocean">Ocean</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>

          <h3 style={{marginTop: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px'}}>Privacy</h3>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontWeight: 500}}>Data Sharing for AI</p>
              <p style={{margin: 0, fontSize: '0.85rem', color: '#64748b'}}>Allow anonymized trip data to improve AI models.</p>
            </div>
            <button 
              onClick={() => setDataSharing(!dataSharing)}
              style={{
                width: '50px', height: '26px', borderRadius: '13px', border: 'none',
                background: dataSharing ? 'var(--primary)' : '#cbd5e1',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
              }}
            >
              <div style={{
                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '3px', left: dataSharing ? '27px' : '3px', transition: 'left 0.3s'
              }}/>
            </button>
          </div>
          
          <div style={{marginTop: '20px'}}>
             <button className="btn-secondary" style={{color: '#ef4444'}}>Delete Account</button>
          </div>

        </div>
      </div>
    </div>
  );
}
