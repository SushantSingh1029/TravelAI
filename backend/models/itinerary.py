from pydantic import BaseModel, Field
from typing import List, Optional

class ItineraryActivity(BaseModel):
    activity_name: str = Field(description="Name or title of the activity")
    place_id: Optional[str] = Field(None, description="Optional MongoDB ObjectId of the place if it matches a known destination place")
    description: str = Field(description="Short description of what the user will do")
    cost: float = Field(description="Estimated cost for this activity")
    start_time: str = Field(description="Start time, e.g., '09:00 AM'")
    end_time: str = Field(description="End time, e.g., '11:00 AM'")
    duration: str = Field(description="Duration of the activity, e.g., '2 hours'")
    travel_time: str = Field(description="Estimated travel time to get here, e.g., '30 mins'")
    latitude: Optional[float] = Field(None, description="GPS latitude for map routing")
    longitude: Optional[float] = Field(None, description="GPS longitude for map routing")

class BudgetBreakdown(BaseModel):
    accommodation: float
    food: float
    transportation: float
    activities: float
    miscellaneous: float
    total: float

class ItineraryDay(BaseModel):
    day_number: int = Field(description="The day number in the sequence, e.g., 1")
    date: Optional[str] = Field(None, description="The specific date if applicable")
    theme: str = Field(description="A catchy theme for the day, e.g., 'Historical Wonders'")
    activities: List[ItineraryActivity]

class Itinerary(BaseModel):
    destination: str
    days: List[ItineraryDay]
    budget_breakdown: BudgetBreakdown
    explanations: List[str] = Field(default=[], description="Explanations for any required places that could not be reasonably fit into the itinerary.")
