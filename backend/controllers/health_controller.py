from fastapi import APIRouter
from backend.config.database import db_instance

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/health/db")
async def db_health_check():
    try:
        # Send a ping to confirm a successful connection
        await db_instance.client.admin.command('ping')
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "details": str(e)}
