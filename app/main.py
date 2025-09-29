from fastapi import FastAPI
from config.config import settings


app = FastAPI(version=str(settings.APP_VERSION))

