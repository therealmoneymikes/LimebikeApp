from authzed.api.v1 import Client
from authzed.api.v1 import (
    WriteSchemaRequest,
    WriteRelationshipsRequest,
    RelationshipUpdate,
    Relationship,
    SubjectReference,
    ObjectReference,
    CheckPermissionRequest,
    CheckPermissionResponse,
    Consistency,
)
from grpcutil import insecure_bearer_token_credentials

# Connect to SpiceDB
client = Client(
    "localhost:50051",
    insecure_bearer_token_credentials("your-preshared-key-here")
)

# 1. Write Schema
schema = """
definition user {}

definition pickup_point {
    relation manager: user 
    relation assigned_user: user

    permission read = manager + assigned_user
    permission write = manager 
}

definition bike {
    relation owner: user
    relation assigned_admin: user
    relation assigned_user: user

    permission read = owner + assigned_admin + assigned_user
    permission write = owner + assigned_admin
}

definition app {
    relation admin: user
    relation user: user

    permission manage_users = admin
    permission view_dashboard = admin + user
}
"""

print("Writing schema...")
response = client.WriteSchema(WriteSchemaRequest(schema=schema))
print(f"✓ Schema written at: {response.written_at}")

# 2. Write Relationships
print("\nWriting relationships...")
updates = [
    # Alice is a manager of pickup_point:location1
    RelationshipUpdate(
        operation=RelationshipUpdate.OPERATION_CREATE,
        relationship=Relationship(
            resource=ObjectReference(
                object_type="pickup_point",
                object_id="location1"
            ),
            relation="manager",
            subject=SubjectReference(
                object=ObjectReference(
                    object_type="user",
                    object_id="alice"
                )
            )
        )
    ),
    # Bob is an assigned_user of pickup_point:location1
    RelationshipUpdate(
        operation=RelationshipUpdate.OPERATION_CREATE,
        relationship=Relationship(
            resource=ObjectReference(
                object_type="pickup_point",
                object_id="location1"
            ),
            relation="assigned_user",
            subject=SubjectReference(
                object=ObjectReference(
                    object_type="user",
                    object_id="bob"
                )
            )
        )
    ),
]

response = client.WriteRelationships(WriteRelationshipsRequest(updates=updates))
print(f"✓ Relationships written at: {response.written_at}")

# 3. Check Permissions
print("\nChecking permissions...")

# Check if Alice can write (she's a manager, so YES)
check_alice_write = CheckPermissionRequest(
    resource=ObjectReference(
        object_type="pickup_point",
        object_id="location1"
    ),
    permission="write",
    subject=SubjectReference(
        object=ObjectReference(
            object_type="user",
            object_id="alice"
        )
    ),
    consistency=Consistency(fully_consistent=True)
)

response = client.CheckPermission(check_alice_write)
has_permission = response.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION
print(f"✓ Alice can write to location1: {has_permission}")

# Check if Bob can write (he's only assigned_user, so NO)
check_bob_write = CheckPermissionRequest(
    resource=ObjectReference(
        object_type="pickup_point",
        object_id="location1"
    ),
    permission="write",
    subject=SubjectReference(
        object=ObjectReference(
            object_type="user",
            object_id="bob"
        )
    ),
    consistency=Consistency(fully_consistent=True)
)

response = client.CheckPermission(check_bob_write)
has_permission = response.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION
print(f"✓ Bob can write to location1: {has_permission}")

# Check if Bob can read (he's assigned_user, so YES)
check_bob_read = CheckPermissionRequest(
    resource=ObjectReference(
        object_type="pickup_point",
        object_id="location1"
    ),
    permission="read",
    subject=SubjectReference(
        object=ObjectReference(
            object_type="user",
            object_id="bob"
        )
    ),
    consistency=Consistency(fully_consistent=True)
)

response = client.CheckPermission(check_bob_read)
has_permission = response.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION
print(f"✓ Bob can read location1: {has_permission}")

print("\n✅ All tests completed!")