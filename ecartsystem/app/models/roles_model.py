from fastapi import FastAPI
from sqlalchemy import Column, Integer, String,ForeignKey,VARCHAR,Table
from sqlalchemy.orm import relationship,Mapped,mapped_column
from app.core.db import Base
from typing import List,Text
from app.models.user_model import User

class Role_permission(Base):
    __tablename__ ="roles_permission"
    roles_id :Mapped[int] = mapped_column(ForeignKey("roles.id"),primary_key=True) 
    permissions_id : Mapped[int] = mapped_column(ForeignKey("permissions.id"),primary_key=True) 
    
class Roles(Base):

    __tablename__ ="roles"
    id : Mapped[int] = mapped_column(primary_key=True)
    role_name : Mapped[str] = mapped_column()
    
    users: Mapped[List["User"]] = relationship(back_populates="role")
    permissions : Mapped[List["Permissions"]] = relationship(secondary="roles_permission",back_populates="roles")
    
class Permissions(Base):
    __tablename__ ="permissions"
    id :Mapped[int] = mapped_column(primary_key=True)
    permissions :Mapped[str] =mapped_column()
    
    roles : Mapped[List["Roles"]] = relationship(secondary="roles_permission",back_populates="permissions")

