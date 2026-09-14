import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from backend.config.settings import settings

async def seed_db():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]

    print("Dropping existing destinations and places collections...")
    await db.destinations.drop()
    await db.places.drop()

    destinations_data = [
        {
            "name": "Bali",
            "country": "Indonesia",
            "description": "Island of the Gods, famous for its beaches, temples, and vibrant culture.",
            "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            "latitude": -8.409518,
            "longitude": 115.188919,
            "categories": ["Beach", "Culture", "Nature"]
        },
        {
            "name": "Singapore",
            "country": "Singapore",
            "description": "A modern island city-state in Southeast Asia.",
            "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
            "latitude": 1.352083,
            "longitude": 103.819836,
            "categories": ["City", "Food", "Shopping"]
        },
        {
            "name": "Dubai",
            "country": "United Arab Emirates",
            "description": "A city of skyscrapers, luxury shopping, and desert safaris.",
            "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
            "latitude": 25.2048,
            "longitude": 55.2708,
            "categories": ["Luxury", "Desert", "City"]
        },
        {
            "name": "Tokyo",
            "country": "Japan",
            "description": "A bustling metropolis mixing the ultramodern and the traditional.",
            "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
            "latitude": 35.6762,
            "longitude": 139.6503,
            "categories": ["City", "Culture", "Food"]
        },
        {
            "name": "Paris",
            "country": "France",
            "description": "The city of light and romance.",
            "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "categories": ["Romance", "Culture", "History"]
        },
        {
            "name": "Maldives",
            "country": "Maldives",
            "description": "A tropical paradise of pristine beaches and coral reefs.",
            "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
            "latitude": 3.2028,
            "longitude": 73.2207,
            "categories": ["Beach", "Luxury", "Nature"]
        }
    ]

    print("Inserting destinations...")
    dest_result = await db.destinations.insert_many(destinations_data)
    
    # Get Bali ID
    bali_id = None
    for i, dest in enumerate(destinations_data):
        if dest["name"] == "Bali":
            bali_id = str(dest_result.inserted_ids[i])
            break

    bali_places = [
        {
            "destination_id": bali_id,
            "name": "Uluwatu Temple",
            "description": "A Balinese Hindu sea temple located in Uluwatu, famous for its cliffside location and sunset views.",
            "category": "Culture",
            "latitude": -8.8291,
            "longitude": 115.0886,
            "rating": 4.8,
            "estimated_cost": 5.0,
            "recommended_duration_minutes": 120,
            "image_url": "https://images.unsplash.com/photo-1554481923-a691d78ca9cb",
            "best_time": "Late afternoon for sunset and Kecak dance",
            "tags": ["Temple", "Sunset", "Ocean"]
        },
        {
            "destination_id": bali_id,
            "name": "Tegallalang Rice Terrace",
            "description": "Beautiful terraced rice paddies offering scenic landscapes and traditional irrigation systems.",
            "category": "Nature",
            "latitude": -8.4333,
            "longitude": 115.2797,
            "rating": 4.7,
            "estimated_cost": 3.0,
            "recommended_duration_minutes": 90,
            "image_url": "https://images.unsplash.com/photo-1553603417-64cce17b2b80",
            "best_time": "Early morning to avoid crowds",
            "tags": ["Nature", "Photography", "Agriculture"]
        },
        {
            "destination_id": bali_id,
            "name": "Sacred Monkey Forest Sanctuary",
            "description": "A nature reserve and Hindu temple complex in Ubud, home to hundreds of long-tailed macaques.",
            "category": "Wildlife",
            "latitude": -8.5194,
            "longitude": 115.2590,
            "rating": 4.6,
            "estimated_cost": 8.0,
            "recommended_duration_minutes": 120,
            "image_url": "https://images.unsplash.com/photo-1549471013-3364d7320f92",
            "best_time": "Morning or late afternoon",
            "tags": ["Wildlife", "Nature", "Temple"]
        },
        {
            "destination_id": bali_id,
            "name": "Mount Batur",
            "description": "An active volcano in Bali, popular for sunrise trekking to see the breathtaking views.",
            "category": "Adventure",
            "latitude": -8.2393,
            "longitude": 115.3776,
            "rating": 4.9,
            "estimated_cost": 40.0,
            "recommended_duration_minutes": 300,
            "image_url": "https://images.unsplash.com/photo-1563172081-30d860d5b40d",
            "best_time": "Pre-dawn (start hike at 2 AM for sunrise)",
            "tags": ["Hiking", "Volcano", "Sunrise"]
        },
        {
            "destination_id": bali_id,
            "name": "Tanah Lot Temple",
            "description": "Iconic offshore Hindu temple sitting on a rock formation, incredibly popular at sunset.",
            "category": "Culture",
            "latitude": -8.6212,
            "longitude": 115.0868,
            "rating": 4.7,
            "estimated_cost": 4.0,
            "recommended_duration_minutes": 90,
            "image_url": "https://images.unsplash.com/photo-1535492167666-8d19760773dd",
            "best_time": "Sunset",
            "tags": ["Temple", "Ocean", "Photography"]
        },
        {
            "destination_id": bali_id,
            "name": "Sekumpul Waterfall",
            "description": "Often cited as the most beautiful waterfall in Bali, hidden in the lush northern jungles.",
            "category": "Nature",
            "latitude": -8.1746,
            "longitude": 115.1843,
            "rating": 4.9,
            "estimated_cost": 10.0,
            "recommended_duration_minutes": 180,
            "image_url": "https://images.unsplash.com/photo-1543789528-7fb0fcc0da1e",
            "best_time": "Morning",
            "tags": ["Waterfall", "Hiking", "Nature"]
        },
        {
            "destination_id": bali_id,
            "name": "Seminyak Beach",
            "description": "A stylish beach area known for its upscale resorts, beach clubs, and stunning sunsets.",
            "category": "Beach",
            "latitude": -8.6913,
            "longitude": 115.1610,
            "rating": 4.5,
            "estimated_cost": 0.0,
            "recommended_duration_minutes": 180,
            "image_url": "https://images.unsplash.com/photo-1582268494870-13f50536c478",
            "best_time": "Late afternoon into the evening",
            "tags": ["Beach", "Nightlife", "Relaxation"]
        },
        {
            "destination_id": bali_id,
            "name": "Campuhan Ridge Walk",
            "description": "A scenic, paved nature walk offering sweeping hillside views in the heart of Ubud.",
            "category": "Nature",
            "latitude": -8.5036,
            "longitude": 115.2547,
            "rating": 4.6,
            "estimated_cost": 0.0,
            "recommended_duration_minutes": 60,
            "image_url": "https://images.unsplash.com/photo-1534067980313-91bd9b76c8c4",
            "best_time": "Early morning or late afternoon",
            "tags": ["Walking", "Views", "Nature"]
        },
        {
            "destination_id": bali_id,
            "name": "Nusa Penida Island",
            "description": "An island southeast of Bali known for dramatic coastal cliffs, like Kelingking Beach.",
            "category": "Adventure",
            "latitude": -8.7278,
            "longitude": 115.5444,
            "rating": 4.8,
            "estimated_cost": 50.0,
            "recommended_duration_minutes": 480,
            "image_url": "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f",
            "best_time": "Full day trip",
            "tags": ["Island", "Cliffs", "Beaches"]
        },
        {
            "destination_id": bali_id,
            "name": "Waterbom Bali",
            "description": "A premier waterpark in Kuta featuring thrilling rides and relaxing pools set in tropical gardens.",
            "category": "Entertainment",
            "latitude": -8.7291,
            "longitude": 115.1691,
            "rating": 4.9,
            "estimated_cost": 35.0,
            "recommended_duration_minutes": 240,
            "image_url": "https://images.unsplash.com/photo-1559815074-cecf23efb672",
            "best_time": "Morning to early afternoon",
            "tags": ["Waterpark", "Family", "Fun"]
        }
    ]

    print("Inserting places for Bali...")
    await db.places.insert_many(bali_places)

    print("Database seeding completed successfully.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
