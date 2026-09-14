import { useState } from 'react';
import './Itinerary.css';

export default function BudgetBreakdown({ breakdown, budget, tripId, currentItinerary, onOptimized, onBookTrip }) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!breakdown) return null;

  // Extract numeric value from budget string
  const getNumericBudget = (budgetString) => {
    if (!budgetString) return 0;
    const num = budgetString.replace(/[^0-9]/g, '');
    return parseInt(num, 10) || 0;
  };

  const numericBudget = getNumericBudget(budget);
  const isOverBudget = numericBudget > 0 && breakdown.total > numericBudget;
  const overage = breakdown.total - numericBudget;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const api = (await import('../../services/api')).default;
      const payload = { current_itinerary: currentItinerary };
      const res = await api.post(`/api/trips/${tripId}/optimize-budget`, payload);
      onOptimized(res.data.itinerary);
    } catch (err) {
      console.error(err);
      alert("Failed to optimize budget");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="budget-breakdown">
      <h3>Budget Breakdown</h3>
      
      {isOverBudget && (
        <div className="budget-warning slide-up">
          <p>⚠️ This trip exceeds your budget by ${overage}.</p>
          <button 
            className="btn-primary highlight optimize-btn" 
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? "Optimizing..." : "Optimize Budget"}
          </button>
        </div>
      )}

      <div className="budget-grid">
        <div className="budget-item">
          <span className="budget-label">Accommodation</span>
          <span className="budget-value">${breakdown.accommodation}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Food & Dining</span>
          <span className="budget-value">${breakdown.food}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Transportation</span>
          <span className="budget-value">${breakdown.transportation}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Activities</span>
          <span className="budget-value">${breakdown.activities}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Miscellaneous</span>
          <span className="budget-value">${breakdown.miscellaneous}</span>
        </div>
      </div>
      <div className="budget-total">
        <span>Total Estimated</span>
        <span>${breakdown.total}</span>
      </div>
      <div className="budget-target">
        <span>Target Budget</span>
        <span>{budget}</span>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }} onClick={onBookTrip}>
          Book Trip
        </button>
      </div>
    </div>
  );
}
