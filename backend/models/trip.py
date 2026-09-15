from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TripRequest(BaseModel):
    destination_id: Optional[str] = None
    destination_name: Optional[str] = None
    days: int
    budget: str
    travellers: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    preferences: Optional[dict] = None
    favorite_place_ids: Optional[List[str]] = []

class RegenerateRequest(BaseModel):
    current_itinerary: dict
    change_set: dict
    feedback: Optional[str] = None

class OptimizeRequest(BaseModel):
    current_itinerary: dict

class TripResponse(BaseModel):
    id: str
    user_id: str
    destination_id: Optional[str] = None
    destination_name: Optional[str] = None
    days: int
    budget: str
    travellers: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    preferences: dict
    favorite_place_ids: List[str]
    status: str
    created_at: str
    updated_at: str
    itinerary: Optional[dict] = None
