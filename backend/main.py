from fastapi import FastAPI,Depends,HTTPException,status
from .database import engine,get_db
from . import models , schemas
from sqlalchemy.orm import Session
from .routers import user,mood

app=FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(user.router)

