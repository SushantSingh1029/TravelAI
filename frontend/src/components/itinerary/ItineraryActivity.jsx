import { useState } from 'react';

export default function ItineraryActivity({ activity, onRemove, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    activity_name: activity.activity_name,
    start_time: activity.start_time,
    end_time: activity.end_time,
    description: activity.description
  });

  const handleSave = () => {
    onEdit({ ...activity, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className={`itinerary-activity ${activity.isRemoved ? 'removed' : ''}`}>
      <div className="activity-timeline">
        <div className="time-block">
          <span className="start-time">{activity.start_time}</span>
          <span className="end-time">{activity.end_time}</span>
        </div>
        <div className="timeline-line">
          <div className="timeline-dot"></div>
        </div>
      </div>
      
      <div className="activity-content">
        {isEditing ? (
          <div className="edit-activity-form fade-in">
            <input 
              type="text" 
              value={editForm.activity_name} 
              onChange={e => setEditForm({...editForm, activity_name: e.target.value})} 
              className="edit-input font-bold"
            />
            <div className="edit-times">
              <input type="text" value={editForm.start_time} onChange={e => setEditForm({...editForm, start_time: e.target.value})} className="edit-input small" />
              <span> - </span>
              <input type="text" value={editForm.end_time} onChange={e => setEditForm({...editForm, end_time: e.target.value})} className="edit-input small" />
            </div>
            <textarea 
              value={editForm.description} 
              onChange={e => setEditForm({...editForm, description: e.target.value})}
              className="edit-input textarea"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-small save">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn-small cancel">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="activity-header-flex">
              <h4>{activity.activity_name}</h4>
              <div className="activity-controls">
                <button onClick={() => setIsEditing(true)} className="control-btn">Edit</button>
                <button onClick={() => onRemove(activity)} className="control-btn danger">Remove</button>
              </div>
            </div>
            <p className="activity-desc">{activity.description}</p>
            
            <div className="activity-meta">
              <span className="meta-badge duration">⏱️ {activity.duration}</span>
              {activity.travel_time && (
                <span className="meta-badge travel">🚗 {activity.travel_time}</span>
              )}
              {activity.cost > 0 ? (
                <span className="meta-badge cost">💵 ${activity.cost}</span>
              ) : (
                <span className="meta-badge free">Free</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
