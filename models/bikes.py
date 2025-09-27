from base import Base
from sqlalchemy.dialects.postgresql import UUID, ENUM, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy import Column, String, Enum, UUID, Float, DateTime
import enum


#For  Cross-DB / multi-dialect backend → use sqlalchemy-utils UUIDType:
#binary=True option can store as 16-byte binary in DB for efficiency.
# binary=False stores as string (text).


""" 
str, enum.Enum = Enum values are actual Python strings, not Enum objects.
    You can compare directly with strings:
    
    This enum class is a string-based enum, meaning each member behaves like a Python string. It inherits from str
    
    bike = BikeTypeEnum.electric 
    print(bike == "electric")  # True
    print(isinstance(bike, str))  # True
    
Now str is after Enum, so: Enum members are Enum objects, not strings.
    Comparisons with strings fail: 

    “This enum class is an enum that also mixes in string, but the enum behavior takes priority because enum.Enum is first. Each member is primarily an enum object, not a string, so you cannot compare it directly with a string; you must use the .value attribute to access the underlying string.”
    
    You’d have to use bike.value == "electric" instead.
    bike = BikeTypeEnum.electric
    print(bike == "electric")  # False
    print(isinstance(bike, str))  # False

### SQLAlchemy works well with Enum(str, enum.Enum) because: ###

It can store the string representation in the DB.

You can compare directly with Python strings in your code (bike.type == "electric").

This is especially useful with hybrid Postgres enum types.

"""

class BikeTypeEnum(str,enum.Enum):
    standard = "standard"
    electric = "electric"
    cargo = "cargo"
    
class Bike(Base):
    __tablename__ = "bikes"
    """ as_uuid=True This way, your code naturally uses uuid.UUID objects, which are safer than strings for comparisons, hashing, and generation.


    Only skip as_uuid=True if you really need strings in Python (rare).

    Later, you can migrate to a geospatial column if you implement radius search, clustering, or “nearest bike” efficiently.
    
    Use sqlalchemy.DateTime if you want to keep the schema portable.

    Use postgresql.TIMESTAMP(timezone=True) if you’re optimizing for Postgres and want precise control.
    
    wire-compatible with Postgres
"""
    id = Column(UUID(as_uuid=True), unique=True)
    bike_type = Column(Enum(BikeTypeEnum), nullable=False)
    longitude = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    commissioned_date = Column(TIMESTAMP, nullable=False, server_default=func.now())