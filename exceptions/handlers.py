from functools import wraps
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, DataError, OperationalError, InvalidRequestError, StatementError, DisconnectionError, TimeoutError
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncSession
from exceptions.db_exceptions import DatabaseOperationError, UserNotFoundError, EmailAlreadyExistsError, UnauthorizedUpdateError 


def handle_db_exceptions(operation_name: str):
    """
    Decorator to handle database exceptions consistently across all CRUD operations.
    
    Args:
        operation_name: Name of the operation for logging (e.g., "update_user", "create_post")
        
        What the Decorator Does:

        Intercepts the CRUD function call
        Executes the real CRUD function inside try/except
        Catches SQLAlchemy exceptions (IntegrityError, OperationalError, etc.)
        Performs automatic await db.rollback()
        Converts SQLAlchemy exceptions to your custom exceptions
        Lets through your custom domain exceptions unchanged
        Logs errors with the operation name you specified 
        
        Benefits:

        Zero imports: CRUD functions don't need to import any exception classes
        Clean code: No try/except blocks in CRUD functions
        Automatic rollback: Database cleanup happens automatically
        Consistent: Same error handling across all CRUD operations
        Maintainable: Change exception handling in one place  
    """
    def decorator(func):
        # LINE 2: Preserve original function metadata -> Take the crud function
        # And prepares to wrap it
       
        """
            🏷️ @wraps(func) copies metadata from original function to wrapper.
            Without this, the wrapped function would lose its name, docstring, etc.
            
            Before @wraps: wrapper.__name__ = "wrapper"
            After @wraps:  wrapper.__name__ = "update_user" (original name)
        """
        @wraps(func)
        #Wrapper this ID the function is going to be executed when CRUD function is called
        async def wrapper(*args, **kwargs):
            # Find the database session in the arguments
            """
            🎁 This is the WRAPPER function that actually executes when
            someone calls the decorated CRUD function.
            
            Args:
                *args: All positional arguments passed to CRUD function
                **kwargs: All keyword arguments passed to CRUD function
                
            Example call: await update_user(db, user_id, data, current_user_id)
                        becomes: await wrapper(db, user_id, data, current_user_id)
            """
            
            
            """
            🔍 We need to find the AsyncSession object to call rollback if needed.
            The db session could be passed as positional or keyword argument.
            """
            db = None
            for arg in args:
                
                if isinstance(arg, AsyncSession):
                    """
                    
                    🔄 Loop through all positional arguments (*args).
                    Example: args = (db_session, uuid_obj, update_data, current_user_id)
                    
                    ✅ Check if this argument is a database session.
                    isinstance(arg, AsyncSession) returns True if arg is a session object.
                    
                    db = arg
                    
                    📌 Save the session object so we can call rollback later.
                    
                    break
                
                    🛑 Stop searching once we find the session.
                    """
                    db = arg
                    break
            
            if not db:
                """ """
                # Look in kwargs for db if it's not found in *args
                db = kwargs.get('db')
            
            try:
                """
                🎯 This is where we actually call the original CRUD function.
                Everything below is exception handling.
                
                🚀 Execute the real CRUD function with all original arguments.
                
                Example: If original call was update_user(db, user_id, data)
                        This line calls the REAL update_user function
                        
                If function succeeds: Return its result normally
                If function fails: Jump to except blocks below
                """
                return await func(*args, **kwargs)
                
                
            # It means: "If ANY of these three exceptions occur, let them pass through unchanged to the route level."
            except (UserNotFoundError, EmailAlreadyExistsError, UnauthorizedUpdateError):
                """
                🎭 These are OUR custom business logic exceptions.
                We DON'T want to convert these - they're already the right type.
                We DON'T want to rollback - these aren't database errors.
                """
                """
                
                Raise 
                ↗️ Re-raise the same exception without modification.
                This passes the exception up to the route handler unchanged.
                """
                raise 
             
                
            except IntegrityError as e:
                if db:
                    await db.rollback()
                #logger.warning(f"{operation_name}: Integrity constraint violated - {str(e)}")
                
                # Parse common constraint violations
                error_msg = str(e.orig).lower() if hasattr(e, 'orig') else str(e).lower()
                if "unique" in error_msg and "email" in error_msg:
                    raise EmailAlreadyExistsError("Email already exists")
                elif "foreign key" in error_msg:
                    raise DatabaseOperationError(operation_name, "Referenced record does not exist")
                else:
                    raise DatabaseOperationError(operation_name, f"Data integrity violation")
                    
            except (OperationalError, TimeoutError) as e:
                if db:
                   
                    """
                    ❓ Only rollback if we found a database session.
                     ⚠️ These are serious database problems:
                    - OperationalError: Database down, connection lost, permission denied
                    - TimeoutError: Query took too long, deadlock
                    """
                    await db.rollback()
                    """
                    🔄 Undo any changes made in this transaction.
                    This puts the database back to a clean state.
                    """
                # logger.error(f"{operation_name}: Database operational error - {str(e)}")
                raise DatabaseOperationError(operation_name, "Database temporarily unavailable")
                
            except SQLAlchemyError as e:
                
                """
                🔧 Catch any other SQLAlchemy exception we didn't handle above.
                SQLAlchemyError is the base class for all SQLAlchemy exceptions.
                
                """
                if db:
                    await db.rollback()
                # logger.error(f"{operation_name}: Unexpected database error - {str(e)}")
                raise DatabaseOperationError(operation_name, "Database error occurred")
                
            except Exception as e:
                """
                💥 This catches ANY other Python exception.
                Could be: KeyError, ValueError, network errors, memory errors, etc.
                """
                if db:
                    await db.rollback()
                # logger.error(f"{operation_name}: Unexpected error - {str(e)}")
                raise DatabaseOperationError(operation_name, f"Unexpected error: {str(e)}")
            
        """
        🎁 Return the wrapper function.
        This wrapper will REPLACE the original CRUD function.
        
        So when you do: @handle_db_exceptions("update_user")
        The original update_user function gets replaced with this wrapper.
        """
                
        return wrapper
    
      
    return decorator


""" 
    Key Points:
🎭 Business Logic Exceptions (Pass Through):

UserNotFoundError → "User doesn't exist" (business condition)
EmailAlreadyExistsError → "Email taken" (business rule violation)
UnauthorizedUpdateError → "Permission denied" (authorization failure)

Why pass through?

These are intentional exceptions representing valid business scenarios
No database cleanup needed - the transaction is still valid
Route handler should decide the HTTP response (404, 400, 403)

🚫 Database Exceptions (Convert & Rollback):

IntegrityError → Database constraint violated
OperationalError → Database connection/operation failed
TimeoutError → Query took too long

Why convert?

These are unexpected database problems
Require await db.rollback() to clean up the transaction
Should become generic DatabaseOperationError
Route handler treats as 500 Internal Server Error

"""