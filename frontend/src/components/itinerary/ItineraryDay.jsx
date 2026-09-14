import ItineraryActivity from './ItineraryActivity';

export default function ItineraryDay({ day, onAddPlaceClick, onRemoveActivity, onEditActivity }) {
  return (
    <div className="itinerary-day">
      <div className="day-header">
        <div className="day-badge">Day {day.day_number}</div>
        <div className="day-title">
          <h3>{day.theme}</h3>
          <span className="day-date">{day.date}</span>
        </div>
      </div>
      
      <div className="activities-list">
        {day.activities.map((activity, index) => (
          <ItineraryActivity 
            key={index} 
            activity={activity} 
            onRemove={() => onRemoveActivity(day.day_number, index, activity)}
            onEdit={(updatedActivity) => onEditActivity(day.day_number, index, updatedActivity)}
          />
        ))}
      </div>

      <div className="add-place-container">
        <button 
          className="btn-secondary add-place-btn" 
          onClick={() => onAddPlaceClick(day.day_number)}
        >
          + Add Place to Day {day.day_number}
        </button>
      </div>
    </div>
  );
}
