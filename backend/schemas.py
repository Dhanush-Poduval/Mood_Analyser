from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class User(BaseModel):
    id:int
    name:str
    email:str
    password:str
class Signup(BaseModel):
    name:str
    email:str
    password:str
class Show_user(BaseModel):
    id:int
    name:str
    email:str
    class Config():
        orm_mode=True
class Login(BaseModel):
    email:str
    password:str

class UserBase(BaseModel):
    name: str
    email: str

    class Config:
        orm_mode = True
class Mood(BaseModel):
    mood:str
    content:str
class Show_Mood(BaseModel):
    mood:str
    content:str
    user_id:int
    created_at:datetime
    class Config():
        orm_mode=True

class Showcase_Moods(BaseModel):
    mood_set:str
    content:str
    userid:int
    created_at:datetime
    owner:UserBase
    class Config():
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel): #jwt
    email: Optional[str]=None