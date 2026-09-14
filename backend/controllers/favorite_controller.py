from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from backend.models.place import PlaceResponse
from backend.config.database import get_database
from backend.middlewares.auth import get_current_user
from bson import ObjectId
from backend.utils.mongo import serialize_docs

router = APIRouter()

class FavoriteRequest(BaseModel):
    place_id: str

@router.post("/")
async def add_favorite(request: FavoriteRequest, user: dict = Depends(get_current_user), db = Depends(get_database)):
    if not ObjectId.is_valid(request.place_id):
        raise HTTPException(status_code=400, detail="Invalid Place ID")
    
    place = await db.places.find_one({"_id": ObjectId(request.place_id)})
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
        
    user_id_str = str(user["_id"])
    existing = await db.favorites.find_one({"user_id": user_id_str, "place_id": request.place_id})
    if existing:
        return {"message": "Already in favorites"}
        
    await db.favorites.insert_one({"user_id": user_id_str, "place_id": request.place_id})
    return {"message": "Added to favorites"}

@router.delete("/{place_id}")
async def remove_favorite(place_id: str, user: dict = Depends(get_current_user), db = Depends(get_database)):
    user_id_str = str(user["_id"])
    await db.favorites.delete_one({"user_id": user_id_str, "place_id": place_id})
    return {"message": "Removed from favorites"}

@router.get("/", response_model=List[PlaceResponse])
async def get_favorites(user: dict = Depends(get_current_user), db = Depends(get_database)):
    user_id_str = str(user["_id"])
    cursor = db.favorites.find({"user_id": user_id_str})
    favs = await cursor.to_list(length=1000)
    
    place_ids = [ObjectId(f["place_id"]) for f in favs if ObjectId.is_valid(f["place_id"])]
    if not place_ids:
        return []
        
    places_cursor = db.places.find({"_id": {"$in": place_ids}})
    places = await places_cursor.to_list(length=1000)
    return serialize_docs(places)
