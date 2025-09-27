from pydantic import BaseModel







class UserCreate(BaseModel):
    email: str
    first_name: str
    surname: str
    phone_number: str


## To fire SES event in kafka
## Best pattern is a transaction outbox + outbox table to avoid dual write problem 
# Event publishing is decoupled → if Kafka is down, user signup still succeeds, event just retries later

class UserCreateOut(BaseModel):
    email: str
    first_name: str
    surname: str
    phone_number: str
    