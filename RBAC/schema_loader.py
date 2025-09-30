from pathlib import Path
from authzed.api.v1 import Client, WriteSchemaRequest
from grpcutil import insecure_bearer_token_credentials

def load_schema_files(schema_dir: str = "schemas") -> str:
    """
    Load all .zed files and combine them into a single schema string.
    SpiceDB expects a single schema, so we'll combine all definitions.
    """
    schema_path = Path(schema_dir)
    schema_parts = []
    
    # Define the order to load files (user_role must be first)
    file_order = [
        "user_role.zed",
        "app.zed",
        "bike.zed",
        "pickup.zed",
    ]
    
    for filename in file_order:
        file_path = schema_path / filename
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                schema_parts.append(content)
        else:
            print(f"Warning: {filename} not found")
    
    # Combine all schemas with newlines
    combined_schema = "\n\n".join(schema_parts)
    return combined_schema

def write_schema_to_spicedb(client: Client, schema_dir: str = "schemas"):
    """
    Load schema files and write them to SpiceDB.
    """
    schema = load_schema_files(schema_dir)
    
    print("Writing schema to SpiceDB...")
    print(f"Schema length: {len(schema)} characters")
    
    response = client.WriteSchema(WriteSchemaRequest(schema=schema))
    print(f"✓ Schema written at: {response.written_at}")
    return response

# Example usage
if __name__ == "__main__":
    # Connect to SpiceDB
    client = Client(
        "localhost:50051",
        insecure_bearer_token_credentials("your-preshared-key")
    )
    
    # Load and write schema from files
    write_schema_to_spicedb(client, schema_dir="schemas")