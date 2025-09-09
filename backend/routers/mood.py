from fastapi import FastAPI,APIRouter,Depends,Form,HTTPException,status
from typing import List
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models,schemas,oauth2

app =FastAPI()

router=APIRouter(tags=['Mood'])
@router.post('/add_mood')
def add_mood(moodshi:schemas.Mood,db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
        mood=models.Mood(mood_set=moodshi.mood,content=moodshi.content,userid=current_user.id)
        user=db.query(models.User).filter(models.User.id==current_user.id).first()
        if not user:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
              
        db.add(mood)
        db.commit()
        db.refresh(mood)

        return mood

@router.put('/update_mood')
def update_mood(mood_id:int, updated_mood:schemas.Mood, db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
    mood=db.query(models.Mood).filter(models.Mood.id==mood_id,models.Mood.userid==current_user.id).first()
    if not mood:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Mood not found")
    mood.mood_set=updated_mood.mood
    db.commit()
    db.refresh(mood)
    return mood

@router.delete('/delete')
def delete_mood(mood_id:int,db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
      moods=db.query(models.Mood).filter(models.Mood.id==mood_id,models.Mood.userid==current_user.id).first()
      if not moods:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No mood log found")
      db.delete(moods)
      db.commit()
      return{'Delete':f'deleted the {moods.id} Mood '}

@router.get('/moods',response_model=List[schemas.Showcase_Moods])
def get_moods(db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
      moods=db.query(models.Mood).filter(models.Mood.userid==current_user.id).all()
      if not moods:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
      return moods
@router.get('/models/{id}',response_model=schemas.Showcase_Moods)
def specific_mood(mood_id:int, db:Session=Depends(get_db),current_user:schemas.Show_user=Depends(oauth2.get_current_user)):
      mood=db.query(models.Mood).filter(models.Mood.id==mood_id,models.Mood.userid==current_user.id).first()
      if not mood:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='No mood created')
      return mood
      
      
