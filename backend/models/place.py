from pydantic import BaseModel
from typing import List

class PlaceResponse(BaseModel):
    id: str
    destination_id: str
    name: str
    description: str
    category: str
    latitude: float
    longitude: float
    rating: float
    estimated_cost: float
    recommended_duration_minutes: int
    image_url: str
    best_time: str
    tags: List[str]
