from fastapi import FastAPI,Depends,HTTPException,status,APIRouter
from ..database import get_db
from .. import models , schemas , token ,oauth2
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
app=FastAPI()



router=APIRouter(tags=['User'])

pwd_context=CryptContext(schemes=['bcrypt'],deprecated="auto")

@router.post('/signup')
def create_user(signup:schemas.Signup , db:Session=Depends(get_db)):
    existing_user=db.query(models.User).filter(models.User.email==signup.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User Already Has An Account")
    hashedPassword=""
    hashedPassword=pwd_context.hash(signup.password)
    new_user=models.User(name=signup.name,email=signup.email,password=hashedPassword)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token=token.create_access_token(
        data={"sub":new_user.email}
    )
    return {"access_token":access_token,"token_type":"bearer"}


@router.post('/login')
def login(db:Session=Depends(get_db),user:OAuth2PasswordRequestForm=Depends()):
    newuser=db.query(models.User).filter(models.User.email==user.username).first()
    if not newuser:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Email Entered is Wrong")
    if not pwd_context.verify(user.password,newuser.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Password is wrong")
    access_token=token.create_access_token(
        data={"sub":user.username}
    )
    print(access_token)
    return{'access_token':access_token,"token_type":"bearer"}

@router.get('/show_user',response_model=List[schemas.Show_user])
def show_user(db:Session=Depends(get_db)):
    user=db.query(models.User).all()
    return user
@router.delete('/delete_user')
def delete_user(db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
    user=db.query(models.User).filter(models.User.id==current_user.id).first()
    db.delete(user)
    db.commit()
    return{'delete':'User Deleted'}

@router.put('/update_password')
def update_name(psw:str, db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
    user=db.query(models.User).filter(models.User.id==current_user.id).first()
    hashedPassword=""
    hashedPassword=pwd_context.hash(psw)
    user.password=hashedPassword
    db.commit()
    db.refresh(user)
    return user
    