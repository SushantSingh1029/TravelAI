import { useState, useEffect } from 'react';
import api from '../services/api';
import '../components/itinerary/Itinerary.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [preferences, setPreferences] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setProfile(res.data);
      setName(res.data.name);
      setCurrency(res.data.preferred_currency || 'USD');
      setPreferences((res.data.travel_preferences || []).join(', '));
      setProfileImage(res.data.profile_image || '');
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        name,
        preferred_currency: currency,
        profile_image: profileImage || null,
        travel_preferences: preferences.split(',').map(p => p.trim()).filter(p => p)
      };
      
      const res = await api.put('/api/auth/profile', payload);
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="page-loading">Loading profile...</div>;

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and travel preferences.</p>
      </div>

      <div className="profile-container" style={{maxWidth: '600px'}}>
        <div className="booking-card">
          <div className="profile-header-img" style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px'}}>
            {profile.profile_image ? (
              <img src={profile.profile_image} alt="Profile" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              <div style={{width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'}}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="profile-titles">
              <h2 style={{margin: '0 0 5px 0'}}>{profile.name}</h2>
              <p style={{margin: 0, color: '#64748b'}}>{profile.email}</p>
            </div>
          </div>

          <div className="profile-form" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={!isEditing}
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px'}}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={profile.email} 
                disabled={true}
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px', background: '#f1f5f9'}}
              />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input 
                type="text" 
                value={profileImage} 
                onChange={(e) => setProfileImage(e.target.value)} 
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px'}}
              />
            </div>

            <div className="form-group">
              <label>Preferred Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                disabled={!isEditing}
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px'}}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Travel Preferences (comma separated)</label>
              <input 
                type="text" 
                value={preferences} 
                onChange={(e) => setPreferences(e.target.value)} 
                disabled={!isEditing}
                placeholder="e.g. Beaches, Adventure, Food"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px'}}
              />
            </div>

            <div className="profile-actions" style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              {isEditing ? (
                <>
                  <button className="btn-secondary" style={{flex: 1}} onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn-primary highlight" style={{flex: 1}} onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <button className="btn-primary" style={{width: '100%'}} onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
