from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.models.destination import DestinationResponse
from backend.models.place import PlaceResponse
from backend.config.database import get_database
from bson import ObjectId
from backend.utils.mongo import serialize_doc, serialize_docs

router = APIRouter()

@router.get("/", response_model=List[DestinationResponse])
async def get_destinations(db = Depends(get_database)):
    cursor = db.destinations.find({})
    destinations = await cursor.to_list(length=100)
    return serialize_docs(destinations)

@router.get("/{id}", response_model=DestinationResponse)
async def get_destination(id: str, db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    dest = await db.destinations.find_one({"_id": ObjectId(id)})
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    return serialize_doc(dest)

@router.get("/{id}/places", response_model=List[PlaceResponse])
async def get_destination_places(id: str, db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    dest = await db.destinations.find_one({"_id": ObjectId(id)})
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
        
    cursor = db.places.find({"destination_id": id})
    places = await cursor.to_list(length=100)
    return serialize_docs(places)
