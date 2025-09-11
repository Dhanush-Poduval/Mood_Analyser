from fastapi import FastAPI,Depends,HTTPException,status
from .database import engine,get_db
from . import models , schemas
from sqlalchemy.orm import Session
from .routers import user,mood
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],     
)


models.Base.metadata.create_all(bind=engine)


app.include_router(user.router)
app.include_router(mood.router)
