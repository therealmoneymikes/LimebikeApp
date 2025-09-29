from fastapi.responses import JSONResponse
from exceptions.db_exceptions import UserNotFoundError, DatabaseOperationError
from main import app
from fastapi import FastAPI, Request


@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(DatabaseOperationError)
async def db_error_handler(request: Request, exc: DatabaseOperationError):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

