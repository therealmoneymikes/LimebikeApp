from typing import Optional
from base import Base
from sqlalchemy import Column, String
from sqlalchemy.orm import declared_attr
from sqlalchemy.dialects.postgresql import UUID
import uuid
from config import namespaces


""" 

    If you use Alembic for migrations:

    Treat it the same as Postgres.

    Just connect to your Cockroach cluster with a Postgres driver (e.g. psycopg2 or asyncpg).
    
    👉 In your Lime-bike system:

    Users, bikes, stations → good UUIDv5 candidates (email, VIN, station ID).

    Rides, payments, maintenance events → better with UUIDv4 (random, high-volume, short-lived).
"""


def generate_user_id(email: str) -> uuid.UUID:
    return uuid.uuid5(namespace=namespaces.USER_UUID_NAMESPACE, name=email)
    

class Users(Base):
    __tablename__ = "users"
   
    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=True) #Raw Phone number
    phone_number_normalized = Column(String, unique=True, nullable=True) #Digits Only
    
 
 
""" 
Option B: Store multiple refresh tokens in a separate table

Pros: Supports multiple sessions per user (mobile, web, tablet).

Can blacklist any token individually.

Better auditability: you know when each token was issued, revoked, or expired.
"""