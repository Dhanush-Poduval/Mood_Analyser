from fastapi import FastAPI,Depends,HTTPException,status,APIRouter
from ..database import get_db
from .. import models , schemas , token
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
app=FastAPI()



router=APIRouter(tags=['User'])

pwd_context=CryptContext(schemes=['bcrypt'],deprecated="auto")

@router.post('/signup')
def create_user(signup:schemas.Signup , db:Session=Depends(get_db)):
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