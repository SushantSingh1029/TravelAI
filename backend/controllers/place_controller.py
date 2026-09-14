from fastapi import APIRouter, HTTPException, Depends
from backend.models.place import PlaceResponse
from backend.config.database import get_database
from bson import ObjectId
from backend.utils.mongo import serialize_doc

router = APIRouter()

@router.get("/{id}", response_model=PlaceResponse)
async def get_place(id: str, db = Depends(get_database)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    place = await db.places.find_one({"_id": ObjectId(id)})
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    return serialize_doc(place)
