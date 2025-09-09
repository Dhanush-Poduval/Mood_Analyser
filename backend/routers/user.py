from fastapi import FastAPI,Depends,HTTPException,status,APIRouter
from ..database import get_db
from .. import models , schemas
from sqlalchemy.orm import Session
from passlib.context import CryptContext

app=FastAPI()

pwd_context=CryptContext(schemes=['bcrypt'],deprecated="auto")

router=APIRouter(tags=['User'])

@router.post('/signup')
def create_user(signup:schemas.Signup , db:Session=Depends(get_db)):
    hashedPassword=""
    hashedPassword=pwd_context.hash(signup.password)
    new_user=models.User(name=signup.name,email=signup.email,password=hashedPassword)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post('/login')
def login(login:schemas.Login,db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==login.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Email Entered is Wrong")
    if not pwd_context.verify(login.password,user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Password is wrong")
    
    
    return user