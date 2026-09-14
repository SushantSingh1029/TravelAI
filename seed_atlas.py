import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

load_dotenv()

async def seed_db():
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("DATABASE_NAME")
    
    if not uri or not db_name:
        print("Missing DB config")
        return
        
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    count = await db.destinations.count_documents({})
    if count > 0:
        print("Destinations already exist!")
        return
        
    print("Seeding destinations...")
    bali_id = ObjectId()
    
    await db.destinations.insert_many([
        {
            "_id": bali_id,
            "name": "Bali",
            "country": "Indonesia",
            "description": "Tropical paradise known for beaches and temples.",
            "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            "best_time_to_visit": "April to October",
            "tags": ["beach", "culture", "nature"]
        },
        {
            "_id": ObjectId(),
            "name": "Paris",
            "country": "France",
            "description": "City of Light, famous for romance and art.",
            "image_url": "https://images.unsplash.com/photo-1502602881469-447819001b3e",
            "best_time_to_visit": "June to August",
            "tags": ["romance", "art", "history"]
        }
    ])
    
    print("Seeding places...")
    await db.places.insert_many([
        {
            "destination_id": str(bali_id),
            "name": "Uluwatu Temple",
            "category": "Culture",
            "image_url": "https://images.unsplash.com/photo-1554481923-a691d78d29de",
            "rating": 4.8,
            "estimated_cost": 5,
            "recommended_duration": 120,
            "latitude": -8.8291,
            "longitude": 115.0886
        },
        {
            "destination_id": str(bali_id),
            "name": "Mount Batur",
            "category": "Adventure",
            "image_url": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647",
            "rating": 4.7,
            "estimated_cost": 45,
            "recommended_duration": 240,
            "latitude": -8.2415,
            "longitude": 115.3776
        }
    ])
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
