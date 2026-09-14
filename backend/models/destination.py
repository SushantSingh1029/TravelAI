from pydantic import BaseModel
from typing import List

class DestinationResponse(BaseModel):
    id: str
    name: str
    country: str
    description: str
    image_url: str
    latitude: float
    longitude: float
    categories: List[str]
