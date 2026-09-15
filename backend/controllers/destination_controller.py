from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.models.destination import DestinationResponse
from backend.models.place import PlaceResponse
from backend.config.database import get_database
from bson import ObjectId
from backend.utils.mongo import serialize_doc, serialize_docs
from backend.services.ai_service import ai_service

router = APIRouter()

@router.get("/explore-global")
async def explore_global(name: str):
    if not name:
        raise HTTPException(status_code=400, detail="Destination name is required")
        
    try:
        places = await ai_service.explore_global_destination(name)
        return places.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search-global")
async def search_global(q: str):
    if not q:
        return []
    import urllib.request
    import urllib.parse
    import json
    try:
        req = urllib.request.Request(
            f"https://nominatim.openstreetmap.org/search?format=json&q={urllib.parse.quote(q)}&limit=5",
            headers={'User-Agent': 'TravelAI/1.0 (contact@travelai.com)'}
        )
        res = urllib.request.urlopen(req)
        data = json.loads(res.read())
        return data
    except Exception as e:
        print(f"Failed to fetch Nominatim: {e}")
        return []

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
