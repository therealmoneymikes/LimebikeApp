from dataclasses import dataclass
from typing import Any, cast
from config.config import settings
from services.authz import AuthzService
from services.rbac_interface import RBAC


authz_config = cast(dict[str, Any], settings.database)


@dataclass
class AuthzConfigSettings:
    SPICEDB_ENDPOINT:str
    SPICEDB_BEARER_TOKEN_KEY: str
    SPICEDB_INSECURE_CONF: bool


authz_config_data = AuthzConfigSettings(SPICEDB_ENDPOINT=str(authz_config.get("SPICEDB_ENDPOINT", "")), 
SPICEDB_BEARER_TOKEN_KEY=str(authz_config.get("SPICEDB_BEARER_TOKEN_KEY", "")),
SPICEDB_INSECURE_CONF=bool(authz_config.get("SPICEDB_INSECURE_CONF", "")))

authz_client = AuthzService(
    spicedb_host=authz_config_data.SPICEDB_ENDPOINT,
    
    token=authz_config_data.SPICEDB_BEARER_TOKEN_KEY,
    insecure=authz_config_data.SPICEDB_INSECURE_CONF,
)

RBAC_INTERFACE = RBAC(authz_client)
