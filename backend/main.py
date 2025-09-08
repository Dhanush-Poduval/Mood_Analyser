from fastapi import FastAPI,Depends
from .database import engine,get_db
from . import models , schemas
from sqlalchemy.orm import Session

app=FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.post('/signup')
def create_user(signup:schemas.Show_user , db:Session=Depends(get_db)):
    new_user=models.User(name=signup.name,email=signup.email,password=signup.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

    