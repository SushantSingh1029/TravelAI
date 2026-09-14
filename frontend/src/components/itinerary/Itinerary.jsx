import { useState, useEffect } from 'react';
import ItineraryDay from './ItineraryDay';
import BudgetBreakdown from './BudgetBreakdown';
import MapView from './MapView';
import AddPlaceModal from './AddPlaceModal';
import BookingConfirmationModal from './BookingConfirmationModal';
import './Itinerary.css';

export default function Itinerary({ trip, itinerary }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  
  // Local state for UI representation
  const [localItinerary, setLocalItinerary] = useState(itinerary);
  
  // Structured change set for backend Phase 17
  const [changeSet, setChangeSet] = useState({
    added_places: [],
    removed_places: [],
    preferred_categories: [],
    disliked_categories: []
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [targetDayForAdd, setTargetDayForAdd] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Booking Phase
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    setLocalItinerary(itinerary);
  }, [itinerary]);

  if (!localItinerary) return <div className="itinerary-loading">No itinerary data available.</div>;

  const activeDayData = localItinerary.days[activeDayIndex];
  const hasChanges = changeSet.added_places.length > 0 || changeSet.removed_places.length > 0;

  // Handlers
  const handleRemoveActivity = (dayNumber, activityIndex, activity) => {
    // 1. Visually remove/mark removed in local state
    const newItin = { ...localItinerary };
    const day = newItin.days.find(d => d.day_number === dayNumber);
    
    day.activities[activityIndex].isRemoved = true;
    
    // 2. Reduce local budget dynamically
    if (activity.cost && !isNaN(activity.cost)) {
      newItin.budget_breakdown.activities = Math.max(0, newItin.budget_breakdown.activities - activity.cost);
      newItin.budget_breakdown.total = Math.max(0, newItin.budget_breakdown.total - activity.cost);
    }
    
    setLocalItinerary(newItin);

    // 3. Track in changeSet
    if (activity.place_id) {
      setChangeSet(prev => ({
        ...prev,
        removed_places: [...prev.removed_places, activity.place_id]
      }));
    }
  };

  const handleEditActivity = (dayNumber, activityIndex, updatedActivity) => {
    const newItin = { ...localItinerary };
    const day = newItin.days.find(d => d.day_number === dayNumber);
    const oldCost = day.activities[activityIndex].cost || 0;
    const newCost = updatedActivity.cost || 0;
    
    day.activities[activityIndex] = updatedActivity;
    
    // Adjust local budget for edits
    const diff = newCost - oldCost;
    newItin.budget_breakdown.activities += diff;
    newItin.budget_breakdown.total += diff;
    
    setLocalItinerary(newItin);
  };

  const handleAddPlaceClick = (dayNumber) => {
    setTargetDayForAdd(dayNumber);
    setShowAddModal(true);
  };

  const handlePlaceAdded = (place) => {
    // 1. Add to change set
    setChangeSet(prev => ({
      ...prev,
      added_places: [...prev.added_places, place],
      preferred_categories: [...new Set([...prev.preferred_categories, place.category])]
    }));

    // 2. Visually append to local itinerary day
    const newItin = { ...localItinerary };
    const day = newItin.days.find(d => d.day_number === targetDayForAdd);
    
    const activityCost = place.estimated_cost || 0;
    
    day.activities.push({
      activity_name: place.name,
      place_id: place.id,
      description: `[Pending AI Reroute] - Category: ${place.category}`,
      cost: activityCost,
      start_time: "TBD",
      end_time: "TBD",
      duration: place.recommended_duration || "TBD",
      travel_time: "TBD",
      latitude: place.latitude,
      longitude: place.longitude,
      isNew: true
    });
    
    // 3. Increase local budget dynamically
    newItin.budget_breakdown.activities += activityCost;
    newItin.budget_breakdown.total += activityCost;
    
    setLocalItinerary(newItin);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // In a real app, you'd want the parent to pass down api/tripId or have context
      // Here we assume api is available. Let's import it at the top of the file!
      const api = (await import('../../services/api')).default;
      
      const payload = {
        current_itinerary: localItinerary,
        change_set: changeSet,
        feedback: feedback
      };
      
      const res = await api.post(`/api/trips/${trip.id}/regenerate-itinerary`, payload);
      
      // Update local state with the returned mocked itinerary
      setLocalItinerary(res.data.itinerary);
      
      // Clear change set and feedback
      setChangeSet({ added_places: [], removed_places: [], preferred_categories: [], disliked_categories: [] });
      setFeedback("");
      
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate itinerary");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleBookTrip = async () => {
    try {
      const api = (await import('../../services/api')).default;
      const res = await api.post('/api/bookings', { trip_id: trip.id });
      setBookingConfirmation(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to book trip");
    }
  };

  return (
    <div className="itinerary-container fade-in">
      {/* Review Changes Bar */}
      {hasChanges && (
        <div className="review-changes-bar slide-up">
          <div className="changes-summary-col">
            <div className="changes-summary">
              <span className="change-badge added">+{changeSet.added_places.length} Added</span>
              <span className="change-badge removed">-{changeSet.removed_places.length} Removed</span>
            </div>
            <p style={{marginTop: '5px'}}>Unsaved changes pending AI recalculation.</p>
          </div>
          <div className="feedback-input-container">
            <input 
              type="text" 
              placeholder="Any other requests? e.g. 'Remove shopping'" 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="feedback-input"
            />
          </div>
          <button className="btn-primary highlight" onClick={handleRegenerate} disabled={isRegenerating}>
            {isRegenerating ? "Regenerating..." : "Apply Changes & Regenerate"}
          </button>
        </div>
      )}

      <div className="itinerary-header">
        <div className="header-content">
          <h1>{localItinerary.destination}</h1>
          <p className="trip-summary-meta">
            {trip.days} Days • {trip.travellers} Travellers
          </p>
        </div>
      </div>

      {localItinerary.explanations && localItinerary.explanations.length > 0 && (
        <div className="itinerary-warnings">
          <h4>⚠️ AI Adjustments</h4>
          <ul>
            {localItinerary.explanations.map((exp, i) => (
              <li key={i}>{exp}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="itinerary-layout">
        <div className="itinerary-main">
          {/* Day Switcher / Navigation */}
          <div className="day-switcher">
            {localItinerary.days.map((day, index) => (
              <button 
                key={day.day_number}
                className={`day-tab ${activeDayIndex === index ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(index)}
              >
                Day {day.day_number}
              </button>
            ))}
          </div>

          <div className="active-day-content">
            {activeDayData && (
              <ItineraryDay 
                day={activeDayData} 
                onAddPlaceClick={handleAddPlaceClick}
                onRemoveActivity={handleRemoveActivity}
                onEditActivity={handleEditActivity}
              />
            )}
          </div>
        </div>
        
        <div className="itinerary-sidebar">
          <div className="map-widget-container">
             <MapView activeDayData={activeDayData} />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <BudgetBreakdown 
              breakdown={localItinerary.budget_breakdown} 
              budget={trip.budget} 
              tripId={trip.id}
              currentItinerary={localItinerary}
              onOptimized={(newItin) => setLocalItinerary(newItin)}
              onBookTrip={handleBookTrip}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddPlaceModal 
          destinationId={trip.destination_id} 
          onClose={() => setShowAddModal(false)} 
          onAddPlace={handlePlaceAdded} 
        />
      )}

      {bookingConfirmation && (
        <BookingConfirmationModal 
          booking={bookingConfirmation} 
          onClose={() => setBookingConfirmation(null)} 
        />
      )}
    </div>
  );
}
