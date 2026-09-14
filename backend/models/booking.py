from pydantic import BaseModel
from typing import Optional

class BookingCreate(BaseModel):
    trip_id: str

class BookingResponse(BaseModel):
    id: str
    user_id: str
    trip_id: str
    destination: str
    booking_reference: str
    status: str
    total_amount: float
    date: Optional[str] = None
    travellers: Optional[int] = 1
    created_at: str
