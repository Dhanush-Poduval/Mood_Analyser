from pydantic import BaseModel

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
    userid:int

class Showcase_Moods(BaseModel):
    mood_set:str
    content:str
    userid:int
    owner:UserBase
    class Config():
        orm_mode = True