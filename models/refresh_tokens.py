from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from base import Base




class RefreshTokenBlacklist(Base):
    __tablename__ = "refresh_token_blacklist"
    """ 
        When a client requests a new access token using a refresh token:

        Check the token against the blacklist (fast lookup via unique index)

        If blacklisted, reject the request
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # user_id + device_id = You can query “all tokens for this user” or “token for this device”
    device_id = Column(String, nullable=False) 
    refresh_token = Column(Boolean, nullable=False, unique=True)
    #Optional, but useful if you want to store history of issued tokens
    revoked = Column(Boolean, nullable=False, default=True)
    #Helps with cleanup of expired tokens
    issued_at = Column(DateTime(timezone=True), nullable=True)
    #index=True on expires_at for efficient periodic deletion
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)