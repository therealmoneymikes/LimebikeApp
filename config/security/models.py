from pydantic import BaseModel



class CurrentUser(BaseModel):
    id: str
    email: str | None
    claims: dict