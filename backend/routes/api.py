from fastapi import APIRouter
from backend.controllers.health_controller import router as health_router
from backend.controllers.auth_controller import router as auth_router
from backend.controllers.destination_controller import router as dest_router
from backend.controllers.place_controller import router as place_router
from backend.controllers.favorite_controller import router as fav_router
from backend.controllers.trip_controller import router as trip_router
from backend.controllers.booking_controller import router as booking_router

router = APIRouter()

router.include_router(health_router, tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(dest_router, prefix="/destinations", tags=["destinations"])
router.include_router(place_router, prefix="/places", tags=["places"])
router.include_router(fav_router, prefix="/favorites", tags=["favorites"])
router.include_router(trip_router, prefix="/trips", tags=["trips"])
router.include_router(booking_router, prefix="/bookings", tags=["bookings"])
