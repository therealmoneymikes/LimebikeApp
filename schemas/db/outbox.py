from datetime import datetime
from typing import Any
from pydantic import BaseModel

from backend.utils.model_enums import AggregateType, OutboxEventStatus






class DBOutboxEvent(BaseModel):
    id: str


class DBOutboxEventRead(BaseModel):
    id: str
    aggregate_type: AggregateType
    aggregate_id: str
    event_type: str
    payload: dict[str, Any]
    created_at: datetime
    processed_at: datetime
    status: OutboxEventStatus
