authz.py = talks to SpiceDB only (pure authorization layer).

user_service.py = talks to DB + calls authz when user actions need role/permission setup.

for gRPC protobufs for spiceDB they are in git clone https://github.com/authzed/api


authzed/api/v1/permission_service.proto (checking permissions)

authzed/api/v1/relationship_service.proto (assigning/revoking roles)

authzed/api/v1/core.proto (types, subjects, resources)


Generate Python gRPC stubs inside the api/ file
python -m grpc_tools.protoc \
  -I. \
  --python_out=./generated \
  --grpc_python_out=./generated \
  authzed/api/v1/permission_service.proto \
  authzed/api/v1/relationship_service.proto \
  authzed/api/v1/core.proto

  This will create *_pb2.py and *_pb2_grpc.py files in generated/authzed/api/v1/.

Copy that generated/ folder into your backend/ (maybe under backend/spicedb_stubs/).

File structure 

client.py  -> AuthzService client wrapper
models.py -> Typed request/response helpers
exceptions.py -> centralised error handling
utils.py -> common helpers (logging, consistency configs)
dependencies.py -> can define a FastAPI Depends function inject RBAC checks