from fastapi import FastAPI,APIRouter,Depends,Form,HTTPException,status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models,schemas

app =FastAPI()

router=APIRouter(tags=['Mood'])

@router.post('/test')
def test():
    return 'Success'

@router.post('/add_mood')
def add_mood(moodshi:schemas.Mood,db:Session=Depends(get_db)):
        mood=models.Mood(mood_set=moodshi.mood,content=moodshi.content,userid=moodshi.userid)
        user=db.query(models.User).filter(models.User.id==mood.userid).first()
        if not user:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
              
        db.add(mood)
        db.commit()
        db.refresh(mood)

        return mood
