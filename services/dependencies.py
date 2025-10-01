from config.config import settings
from services.authz import AuthzService
from services.rbac_interface import RBAC

authz_client = AuthzService(
    spicedb_host=str(settings.SPICEDB_ENDPOINT),
    token=str(settings.SPICEDB_BEARER_TOKEN_KEY),
    insecure=bool(settings.SPICEDB_INSECURE_CONF),
)

RBAC_INTERFACE = RBAC(authz_client)
