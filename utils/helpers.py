





import uuid

from config import namespaces
import phonenumbers
import bcrypt



def hash_password(raw_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(raw_password.encode("utf-8"), salt)
    return hashed.decode()

def generate_user_id(email: str) -> uuid.UUID:
    """ Helper Function that Generates a UUID5 id for user IDs """
    return uuid.uuid5(namespace=namespaces.USER_UUID_NAMESPACE, name=email)


# Use the phonenumbers lib for python
def normalize_phone_number(phone: str, region: str = "GB") -> str:
    
        """ Helper function to normalize users phone numbers by region
            +447305288405 -> 7305288405 
        """
        # Strip whitespace just in case
        try:
            parsed = phonenumbers.parse(phone, region=region)
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number")

            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except Exception as e:
            # “This ValueError happened because of the original exception e.”
            # In Python, raise ... from e is exception chaining.
            raise ValueError(f"Could not parse phone number: {phone}") from e
        
        
        
""" 
    🔹 When to use raise ... from e

    Use it when:

    You’re wrapping a low-level / library exception in a higher-level one

    Example: you’re using phonenumbers, sqlalchemy, or requests, but don’t want to leak those raw exceptions through your service layer.

    Instead, you raise your own app-specific exception while still keeping the cause intact.

    
    from sqlalchemy.exc import IntegrityError

    try:
        session.commit()
    except IntegrityError as e:
        raise ValueError("Duplicate record") from e
    
    
    Logs will show both the IntegrityError and your ValueError.
    
    You want to preserve the debugging trail

Without from e, the original exception is lost.

With from e, the traceback clearly shows both the low-level failure and your high-level wrapper.
"""