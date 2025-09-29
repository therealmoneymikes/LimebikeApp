




from enum import Enum


class AggregateType(str, Enum):
    USER = "user"
    BIKE = "bike"
    ORDER = "order"
    
class OutboxEventStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"