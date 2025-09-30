# services/authz.py
from authzed.api.v1 import (
    Client,
    WriteRelationshipsRequest,
    ReadRelationshipsRequest,
    DeleteRelationshipsRequest,
    RelationshipUpdate,
    Relationship,
    RelationshipFilter,
    SubjectFilter,
    CheckPermissionRequest,
    CheckPermissionResponse,
    LookupResourcesRequest,
    LookupSubjectsRequest,
    ObjectReference,
    SubjectReference,
    Consistency,
)
from grpcutil import bearer_token_credentials, insecure_bearer_token_credentials
from typing import List, Optional


class AuthzService:
    """
    Service for managing authorization with SpiceDB using the authzed client.
    """
    
    def __init__(self, spicedb_host: str, token: str, insecure: bool = False):
        """
        Initialize the AuthzService.
        
        Args:
            spicedb_host: SpiceDB endpoint (e.g., "localhost:50051" or "grpc.authzed.com:443")
            token: API token or preshared key
            insecure: If True, use insecure connection (for local dev only)
        """
        if insecure:
            credentials = insecure_bearer_token_credentials(token)
        else:
            credentials = bearer_token_credentials(token)
        
        self.client = Client(spicedb_host, credentials)
    
    def check_permission(
        self, 
        user_id: str, 
        action: str, 
        resource_type: str,
        resource_id: str
    ) -> bool:
        """
        Check if a user has permission to perform an action on a resource.
        
        Args:
            user_id: The user's ID
            action: The permission to check (e.g., "read", "write")
            resource_type: Type of resource (e.g., "bike", "pickup_point")
            resource_id: The resource's ID
            
        Returns:
            True if user has permission, False otherwise
        """
        request = CheckPermissionRequest(
            resource=ObjectReference(
                object_type=resource_type,
                object_id=resource_id
            ),
            permission=action,
            subject=SubjectReference(
                object=ObjectReference(
                    object_type="user",
                    object_id=user_id
                )
            ),
            consistency=Consistency(fully_consistent=True)
        )
        
        try:
            response = self.client.CheckPermission(request)
            return response.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION
        except Exception as e:
            print(f"Error checking permission: {e}")
            return False
    
    def assign_role(
        self, 
        user_id: str, 
        role: str, 
        resource_type: str,
        resource_id: str
    ) -> bool:
        """
        Assign a role (relation) to a user for a specific resource.
        
        Args:
            user_id: The user's ID
            role: The relation/role (e.g., "owner", "manager", "assigned_user")
            resource_type: Type of resource (e.g., "bike", "pickup_point")
            resource_id: The resource's ID
            
        Returns:
            True if successful, False otherwise
        """
        request = WriteRelationshipsRequest(
            updates=[
                RelationshipUpdate(
                    operation=RelationshipUpdate.OPERATION_CREATE,
                    relationship=Relationship(
                        resource=ObjectReference(
                            object_type=resource_type,
                            object_id=resource_id
                        ),
                        relation=role,
                        subject=SubjectReference(
                            object=ObjectReference(
                                object_type="user",
                                object_id=user_id
                            )
                        )
                    )
                )
            ]
        )
        
        try:
            response = self.client.WriteRelationships(request)
            print(f"✓ Relationship created at: {response.written_at}")
            return True
        except Exception as e:
            print(f"Error assigning role: {e}")
            return False
    
    def remove_role(
        self,
        user_id: str,
        role: str,
        resource_type: str,
        resource_id: str
    ) -> bool:
        """
        Remove a role (relation) from a user for a specific resource.
        
        Args:
            user_id: The user's ID
            role: The relation/role to remove
            resource_type: Type of resource
            resource_id: The resource's ID
            
        Returns:
            True if successful, False otherwise
        """
        request = DeleteRelationshipsRequest(
            relationship_filter=RelationshipFilter(
                resource_type=resource_type,
                optional_resource_id=resource_id,
                optional_relation=role,
                optional_subject_filter=SubjectFilter(
                    subject_type="user",
                    optional_subject_id=user_id
                )
            )
        )
        
        try:
            response = self.client.DeleteRelationships(request)
            print(f"✓ Relationship deleted at: {response.deleted_at}")
            return True
        except Exception as e:
            print(f"Error removing role: {e}")
            return False
    
    def get_user_resources(
        self,
        user_id: str,
        resource_type: str,
        permission: str
    ) -> List[str]:
        """
        Get all resources of a type that a user has a specific permission on.
        
        Args:
            user_id: The user's ID
            resource_type: Type of resource to lookup
            permission: The permission to check for
            
        Returns:
            List of resource IDs the user has access to
        """
        request = LookupResourcesRequest(
            resource_object_type=resource_type,
            permission=permission,
            subject=SubjectReference(
                object=ObjectReference(
                    object_type="user",
                    object_id=user_id
                )
            ),
            consistency=Consistency(fully_consistent=True)
        )
        
        resource_ids = []
        try:
            for result in self.client.LookupResources(request):
                resource_ids.append(result.resource_object_id)
        except Exception as e:
            print(f"Error looking up resources: {e}")
        
        return resource_ids
    
    def get_resource_users(
        self,
        resource_type: str,
        resource_id: str,
        permission: str
    ) -> List[str]:
        """
        Get all users who have a specific permission on a resource.
        
        Args:
            resource_type: Type of resource
            resource_id: The resource's ID
            permission: The permission to check for
            
        Returns:
            List of user IDs who have the permission
        """
        request = LookupSubjectsRequest(
            resource=ObjectReference(
                object_type=resource_type,
                object_id=resource_id
            ),
            permission=permission,
            subject_object_type="user",
            consistency=Consistency(fully_consistent=True)
        )
        
        user_ids = []
        try:
            for result in self.client.LookupSubjects(request):
                user_ids.append(result.subject.subject_object_id)
        except Exception as e:
            print(f"Error looking up subjects: {e}")
        
        return user_ids
    
    def read_relationships(
        self,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        relation: Optional[str] = None,
        subject_type: Optional[str] = None,
        subject_id: Optional[str] = None
    ) -> List[Relationship]:
        """
        Read relationships based on filters.
        
        Args:
            resource_type: Filter by resource type
            resource_id: Filter by resource ID
            relation: Filter by relation
            subject_type: Filter by subject type
            subject_id: Filter by subject ID
            
        Returns:
            List of matching relationships
        """
        # Build subject filter if subject_type or subject_id is provided
        subject_filter = None
        if subject_type or subject_id:
            subject_filter = SubjectFilter(
                subject_type=subject_type or "",
                optional_subject_id=subject_id or ""
            )
        
        request = ReadRelationshipsRequest(
            consistency=Consistency(fully_consistent=True),
            relationship_filter=RelationshipFilter(
                resource_type=resource_type or "",
                optional_resource_id=resource_id or "",
                optional_relation=relation or "",
                optional_subject_filter=subject_filter
            )
        )
        
        relationships = []
        try:
            for rel_response in self.client.ReadRelationships(request):
                relationships.append(rel_response.relationship)
        except Exception as e:
            print(f"Error reading relationships: {e}")
        
        return relationships
    
    def close(self):
        """Close the gRPC channel."""
        # The authzed client handles channel management internally
        # This method is here for compatibility if needed
        pass


# Example usage
if __name__ == "__main__":
    # Initialize service
    authz = AuthzService(
        spicedb_host="localhost:50051",
        token="dev-secret-key-12345",
        insecure=True  # Only for local development
    )
    
    # Assign a role
    authz.assign_role(
        user_id="alice",
        role="owner",
        resource_type="bike",
        resource_id="bike-123"
    )
    
    # Check permission
    can_write = authz.check_permission(
        user_id="alice",
        action="write",
        resource_type="bike",
        resource_id="bike-123"
    )
    print(f"Alice can write to bike-123: {can_write}")
    
    # Get all bikes Alice can read
    bikes = authz.get_user_resources(
        user_id="alice",
        resource_type="bike",
        permission="read"
    )
    print(f"Alice can read bikes: {bikes}")
    
    # Get all users who can read bike-123
    users = authz.get_resource_users(
        resource_type="bike",
        resource_id="bike-123",
        permission="read"
    )
    print(f"Users who can read bike-123: {users}")