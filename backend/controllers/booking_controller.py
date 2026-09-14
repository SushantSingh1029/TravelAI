from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.models.booking import BookingCreate, BookingResponse
from backend.config.database import get_database
from backend.middlewares.auth import get_current_user
from bson import ObjectId
from backend.utils.mongo import serialize_doc, serialize_docs
from datetime import datetime
import random
import string

router = APIRouter()

def generate_booking_ref():
    chars = string.ascii_uppercase + string.digits
    suffix = ''.join(random.choice(chars) for _ in range(6))
    return f"TRV-{suffix}"

@router.post("", response_model=BookingResponse)
async def create_booking(request: BookingCreate, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(request.trip_id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(request.trip_id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    if trip["user_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to book this trip")
        
    # Check if a booking already exists for this trip
    existing = await db.bookings.find_one({"trip_id": request.trip_id})
    if existing:
        return serialize_doc(existing)
        
    # Extract total amount and destination from itinerary
    itinerary = trip.get("itinerary", {})
    total_amount = itinerary.get("budget_breakdown", {}).get("total", 0)
    destination = itinerary.get("destination", "Unknown Destination")
    
    booking_doc = {
        "user_id": str(user["_id"]),
        "trip_id": request.trip_id,
        "destination": destination,
        "booking_reference": generate_booking_ref(),
        "status": "Confirmed",
        "total_amount": total_amount,
        "date": trip.get("start_date", "TBD"),
        "travellers": trip.get("travellers", 1),
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = await db.bookings.insert_one(booking_doc)
    booking_doc["_id"] = result.inserted_id
    
    # Update the trip status to booked
    await db.trips.update_one(
        {"_id": ObjectId(request.trip_id)},
        {"$set": {"status": "booked"}}
    )
    
    return serialize_doc(booking_doc)

@router.get("", response_model=List[BookingResponse])
async def get_user_bookings(user: dict = Depends(get_current_user), db = Depends(get_database)):
    cursor = db.bookings.find({"user_id": str(user["_id"])}).sort("created_at", -1)
    bookings = await cursor.to_list(length=100)
    return serialize_docs(bookings)

@router.get("/{id}", response_model=BookingResponse)
async def get_booking(id: str, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Booking ID")
        
    booking = await db.bookings.find_one({"_id": ObjectId(id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking["user_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        
    return serialize_doc(booking)
