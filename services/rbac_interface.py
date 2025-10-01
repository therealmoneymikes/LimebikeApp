from fastapi import HTTPException, status
from services.authz import AuthzService
import logging


class RBAC:
    def __init__(self, authz: AuthzService, logger: logging.Logger | None = None):
        self.authz = authz
        self.logger = logger or logging.getLogger(__name__)

    def permit(
        self,
        user_id: str,
        permission: str,
        resource_type: str,
        resource_id: str,
    ) -> bool:
        """Enforce permission: raise 403 if not allowed"""
        allowed = self.authz.check_permission(
            user_id=user_id,
            action=permission,
            resource_type=resource_type,
            resource_id=resource_id,
        )

        if not allowed:
            self.logger.warning(
                f"RBAC DENY: user={user_id}, perm={permission}, resource={resource_type}:{resource_id}"
            )
            return allowed

        self.logger.info(
            f"RBAC PERMIT: user={user_id}, perm={permission}, resource={resource_type}:{resource_id}"
        )
        
        return allowed

    def assign(
        self,
        user_id: str,
        role: str,
        resource_type: str,
        resource_id: str,
    ) -> bool:
        return self.authz.assign_role(user_id, role, resource_type, resource_id)

    def remove(
        self,
        user_id: str,
        role: str,
        resource_type: str,
        resource_id: str,
    ) -> bool:
        return self.authz.remove_role(user_id, role, resource_type, resource_id)
    
    
    def assign_default_role(self, user_id: str) -> bool:
        
        """
            Assign the default role for a new user.
            Example: every user becomes owner of their own profile
        """
        return self.assign(
            user_id=user_id,
            role="owner",  # must match your .zed schema
            resource_type="profile",
            resource_id=user_id
        )

