from .database import Base
from sqlalchemy import Column,Integer,String,ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__="user"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    email=Column(String,unique=True)
    password=Column(String,nullable=False)
    moods=relationship("Mood",back_populates='owner')


class Mood(Base):
    __tablename__="mood"
    id=Column(Integer,primary_key=True,index=True)
    mood_set=Column(String)
    content=Column(String)
    userid=Column(Integer,ForeignKey('user.id'))
    owner=relationship("User",back_populates='moods')

