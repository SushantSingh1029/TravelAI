from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    profile_image: Optional[str] = None
    travel_preferences: Optional[List[str]] = []
    preferred_currency: Optional[str] = "USD"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_image: Optional[str] = None
    travel_preferences: Optional[List[str]] = None
    preferred_currency: Optional[str] = None
