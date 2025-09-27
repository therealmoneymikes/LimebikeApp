from datetime import datetime
from typing import Any
from pydantic import BaseModel

from backend.models.enums import AggregateType, OutboxEventStatus






class OutboxEventRead(BaseModel):
    id: str


class OutboxEventReadOut(BaseModel):
    id: str
    aggregate_type: AggregateType
    aggregate_id: str
    event_type: str
    payload: dict[str, Any]
    created_at: datetime
    processed_at: datetime
    status: OutboxEventStatus

