import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

load_dotenv()

async def fix_db():
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DATABASE_NAME")
    
    if not uri or not db_name:
        print("Missing DB config")
        return
        
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    print("Clearing old invalid data...")
    await db.destinations.delete_many({})
    await db.places.delete_many({})
    
    print("Seeding valid destinations...")
    bali_id = ObjectId()
    
    await db.destinations.insert_many([
        {
            "_id": bali_id,
            "name": "Bali",
            "country": "Indonesia",
            "description": "Tropical paradise known for beaches and temples.",
            "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            "latitude": -8.409518,
            "longitude": 115.188919,
            "categories": ["Beach", "Culture", "Nature"]
        },
        {
            "_id": ObjectId(),
            "name": "Paris",
            "country": "France",
            "description": "City of Light, famous for romance and art.",
            "image_url": "https://images.unsplash.com/photo-1502602881469-447819001b3e",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "categories": ["Romance", "Art", "History"]
        }
    ])
    
    print("Seeding places...")
    await db.places.insert_many([
        {
            "destination_id": str(bali_id),
            "name": "Uluwatu Temple",
            "description": "A spectacular cliff-top temple famous for its sunset views and Kecak fire dance.",
            "category": "Culture",
            "latitude": -8.8291,
            "longitude": 115.0886,
            "rating": 4.8,
            "estimated_cost": 5.0,
            "recommended_duration_minutes": 120,
            "image_url": "https://images.unsplash.com/photo-1554481923-a691d78d29de",
            "best_time": "Late Afternoon (Sunset)",
            "tags": ["Culture", "Temple", "Views"]
        },
        {
            "destination_id": str(bali_id),
            "name": "Mount Batur",
            "description": "An active volcano offering incredible sunrise hikes.",
            "category": "Adventure",
            "latitude": -8.2415,
            "longitude": 115.3776,
            "rating": 4.7,
            "estimated_cost": 45.0,
            "recommended_duration_minutes": 240,
            "image_url": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647",
            "best_time": "Early Morning (Sunrise)",
            "tags": ["Hiking", "Nature", "Adventure"]
        }
    ])
    
    print("Database fixed successfully!")

if __name__ == "__main__":
    asyncio.run(fix_db())
