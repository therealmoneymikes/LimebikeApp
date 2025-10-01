







class UserNotFoundError(Exception):
    
    """ Raised when a user is not found"""
    def __init__(self, id: str):
        self.id = id
        super().__init__(f"Unable to find user with id: {self.id}")
        
        
class EmailAlreadyExistsError(Exception):
    """ Raise when user attempts to use an email that already exists"""
    def __init__(self, email: str):
        self.email = email
        super().__init__(f"Email: {self.email} already exists")
        
class UnauthorizedUpdateError(Exception):
    """ Raised when user tries to update data they don't have the authorization"""
    def __init__(self, user_id: str, current_user_id: str):
        self.user_id = user_id
        self.current_user_id = current_user_id
        super().__init__(f"User {current_user_id} cannot update user {user_id}")
    
class DatabaseOperationError(Exception):
    """ Raised when a database operation fails. """
    def __init__(self, operation: str, details: str):
        self.operation = operation
        self.details = details
        super().__init__(f"Database operation '{operation} failed'")   

