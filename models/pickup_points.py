from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geography
import uuid

from base import Base





class PickupPoint(Base):
    __tablename__ = "pickup_points"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False, default=10)
    location = Column(Geography(geometry_type="POINT", srid=4326, spatial_index=True))