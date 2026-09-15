from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.models.trip import TripRequest, TripResponse, RegenerateRequest, OptimizeRequest
from backend.config.database import get_database
from backend.middlewares.auth import get_current_user
from bson import ObjectId
from backend.utils.mongo import serialize_doc, serialize_docs
from datetime import datetime
from backend.services.ai_service import ai_service

router = APIRouter()

@router.post("/{id}/optimize-budget")
async def optimize_budget(id: str, request: OptimizeRequest, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    if trip["user_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
    
    # We pass the current itinerary and the raw budget string from the trip
    payload = {
        "current_itinerary": request.current_itinerary,
        "target_budget": trip["budget"]
    }

    try:
        updated_itinerary = await ai_service.optimize_budget(id, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI optimization failed: {str(e)}")

    # Save the optimized itinerary back to the trip
    await db.trips.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "itinerary": updated_itinerary.model_dump(),
            "updated_at": datetime.utcnow().isoformat()
        }}
    )

    updated_trip = await db.trips.find_one({"_id": ObjectId(id)})
    return serialize_doc(updated_trip)

@router.post("/{id}/regenerate-itinerary")
async def regenerate_itinerary(id: str, request: RegenerateRequest, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    if trip["user_id"] != str(user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")

    # Fetch Destination to pass its context
    dest_name = trip.get("destination_name")
    if trip.get("destination_id") and ObjectId.is_valid(trip["destination_id"]):
        destination = await db.destinations.find_one({"_id": ObjectId(trip["destination_id"])})
        if destination:
            dest_name = destination["name"]
            
    if not dest_name:
        dest_name = "Unknown Location"
    
    # We pass everything to the AI service
    payload = {
        "destination_name": dest_name,
        "trip_config": {
            "days": trip["days"],
            "budget": trip["budget"],
            "travellers": trip["travellers"],
            "preferences": trip.get("preferences", {})
        },
        "current_itinerary": request.current_itinerary,
        "change_set": request.change_set,
        "feedback": request.feedback
    }

    try:
        updated_itinerary = await ai_service.regenerate_itinerary(id, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI regeneration failed: {str(e)}")

    # Save the regenerated itinerary back to the trip
    await db.trips.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "itinerary": updated_itinerary.model_dump(),
            "updated_at": datetime.utcnow().isoformat()
        }}
    )

    updated_trip = await db.trips.find_one({"_id": ObjectId(id)})
    return serialize_doc(updated_trip)

@router.post("/{id}/generate-itinerary")
async def generate_itinerary(id: str, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    user_id_str = str(user["_id"])
    if trip["user_id"] != user_id_str:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")

    # Fetch Destination
    dest_name = trip.get("destination_name")
    if trip.get("destination_id") and ObjectId.is_valid(trip["destination_id"]):
        destination = await db.destinations.find_one({"_id": ObjectId(trip["destination_id"])})
        if destination:
            dest_name = destination["name"]
            
    if not dest_name:
        raise HTTPException(status_code=400, detail="Trip must have a valid destination ID or name")

    # Fetch Favorite Places
    fav_place_ids = [ObjectId(pid) for pid in trip.get("favorite_place_ids", []) if ObjectId.is_valid(pid)]
    favorite_places = []
    if fav_place_ids:
        cursor = db.places.find({"_id": {"$in": fav_place_ids}})
        favorite_places = await cursor.to_list(length=100)

    # Build prompt payload
    trip_context = {
        "destination_name": dest_name,
        "days": trip["days"],
        "budget": trip["budget"],
        "travellers": trip["travellers"],
        "start_date": trip.get("start_date"),
        "end_date": trip.get("end_date"),
        "preferences": trip.get("preferences", {}),
        "favorite_places": [{"name": p["name"], "estimated_cost": p.get("estimated_cost")} for p in favorite_places]
    }

    # Call AI Service
    try:
        generated_itinerary = await ai_service.generate_itinerary(trip_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to Trip
    await db.trips.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "status": "generated",
            "itinerary": generated_itinerary.model_dump(),
            "updated_at": datetime.utcnow().isoformat()
        }}
    )

    updated_trip = await db.trips.find_one({"_id": ObjectId(id)})
    return serialize_doc(updated_trip)

@router.post("/", response_model=TripResponse)
async def create_trip(request: TripRequest, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not request.destination_id and not request.destination_name:
        raise HTTPException(status_code=400, detail="Must provide either a destination_id or destination_name")
        
    user_id_str = str(user["_id"])
    now = datetime.utcnow().isoformat()
    
    trip_data = request.model_dump()
    trip_data["user_id"] = user_id_str
    trip_data["status"] = "pending"
    trip_data["created_at"] = now
    trip_data["updated_at"] = now
    
    result = await db.trips.insert_one(trip_data)
    
    created_trip = await db.trips.find_one({"_id": result.inserted_id})
    return serialize_doc(created_trip)

@router.get("/", response_model=List[TripResponse])
async def get_trips(user: dict = Depends(get_current_user), db = Depends(get_database)):
    user_id_str = str(user["_id"])
    cursor = db.trips.find({"user_id": user_id_str})
    trips = await cursor.to_list(length=100)
    return serialize_docs(trips)

@router.get("/{id}", response_model=TripResponse)
async def get_trip(id: str, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    user_id_str = str(user["_id"])
    if trip["user_id"] != user_id_str:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
        
    return serialize_doc(trip)

@router.put("/{id}", response_model=TripResponse)
async def update_trip(id: str, request: dict, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    user_id_str = str(user["_id"])
    if trip["user_id"] != user_id_str:
        raise HTTPException(status_code=403, detail="Not authorized to update this trip")
        
    update_data = {k: v for k, v in request.items() if k not in ["_id", "user_id", "created_at"]}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    await db.trips.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    
    updated_trip = await db.trips.find_one({"_id": ObjectId(id)})
    return serialize_doc(updated_trip)

@router.delete("/{id}")
async def delete_trip(id: str, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid Trip ID")
        
    trip = await db.trips.find_one({"_id": ObjectId(id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    user_id_str = str(user["_id"])
    if trip["user_id"] != user_id_str:
        raise HTTPException(status_code=403, detail="Not authorized to delete this trip")
        
    await db.trips.delete_one({"_id": ObjectId(id)})
    return {"message": "Trip deleted successfully"}
