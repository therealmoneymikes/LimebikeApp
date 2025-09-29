from sqlalchemy import JSON, Column, DateTime, String, Integer, Enum, func

from backend.models.base import Base
from sqlalchemy.dialects.postgresql import UUID
from backend.utils.model_enums import AggregateType, OutboxEventStatus



""" 
    For an outbox event log, you want enough data to:

    Reconstruct what happened

    Trace why it happened (which request, which user)

    Debug failures when something goes wrong

    Avoid storing sensitive information unnecessarily

    INFO [trace_id=abc123] Created UserCreated event for user=uuid
    
    INFO [trace_id=abc123 event_id=xyz789] Published UserCreated event to Kafka
    
    Tracing (OpenTelemetry)

    Propagate trace_id from incoming request headers (x-request-id, traceparent, etc.).

    Store it in the outbox row → lets you jump from API logs → DB outbox row → Kafka consumer logs in a trace viewer (Jaeger/Tempo).

    Metrics (Prometheus/Grafana)

        Counters: outbox_events_created_total{event_type="UserCreated"}

        Counters: outbox_events_published_total

        Gauge: outbox_events_pending

        Histogram: outbox_publish_latency_seconds


"""



class OutboxEvent(Base):
    # outbox event ID
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, index=True)
    
    # aggregate_type 
    aggregate_type = Column(Enum(AggregateType), nullable=False)
    # aggregate_id
    aggregate_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False) # e.g USER_CREATED
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(OutboxEventStatus), default=OutboxEventStatus.PENDING)