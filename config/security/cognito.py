from fastapi import Header, HTTPException
import jwt
from jose import jwt, jwk as jose_jwt
from jose.utils import base64url_decode
import httpx 



"""# Cognito signs tokens with public JSON Web Keys (JWKS).
# You need to fetch and cache those keys, then validate.
# The claims are all the key-value pairs inside the payload (sub, email, iat, exp, etc.).
# “Unverified claims” means you are reading these values without checking if they were actually issued by Cognito.
    # JWTs are signed (e.g., RS256) to prove authenticity. The signature ensures that:

    # The token was actually issued by your trusted identity provider (Cognito).

    # It has not been tampered with.

    # Its expiration (exp) and intended audience (aud) are valid.

    # Verify the signature using Cognito’s JWKS public key.
    
    IMPORTANT -> If you skip verification:
    Anyone could create a fake JWT with arbitrary values:
        - You would see sub=admin and think this is a real admin user — but it’s fake.
        - Claims like exp (expiration) could be bypassed → tokens could be “reused” indefinitely.
    Check:

    iss (issuer)
    aud (your app client ID)
    exp (expiration)
    token_use (id or access)

Only after verification, trust the claims and use sub as the canonical user id.
"""