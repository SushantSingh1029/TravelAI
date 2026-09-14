from fastapi import APIRouter, Depends, HTTPException, status
from backend.models.user import UserCreate, UserLogin, UserResponse, UserUpdate
from backend.services.auth_service import get_password_hash, verify_password, create_access_token
from backend.config.database import get_database
from backend.middlewares.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_database()
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": user.email,
        "name": user.name,
        "password_hash": hashed_password
    }
    
    result = await db.users.insert_one(new_user)
    
    return UserResponse(
        id=str(result.inserted_id),
        email=new_user["email"],
        name=new_user["name"]
    )

@router.post("/login")
async def login(user_credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": user_credentials.email})
    
    if not user or not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "profile_image": user.get("profile_image"),
        "travel_preferences": user.get("travel_preferences", []),
        "preferred_currency": user.get("preferred_currency", "USD")
    }

@router.put("/profile", response_model=UserResponse)
async def update_profile(update_data: UserUpdate, user: dict = Depends(get_current_user), db = Depends(get_database)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        return await get_me(user)
        
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": update_dict}
    )
    
    updated_user = await db.users.find_one({"_id": user["_id"]})
    return {
        "id": str(updated_user["_id"]),
        "email": updated_user["email"],
        "name": updated_user["name"],
        "profile_image": updated_user.get("profile_image"),
        "travel_preferences": updated_user.get("travel_preferences", []),
        "preferred_currency": updated_user.get("preferred_currency", "USD")
    }
