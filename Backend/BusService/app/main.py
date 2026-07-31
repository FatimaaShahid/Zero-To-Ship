from fastapi import FastAPI

from app.database import Base, engine
from app.routes import routes

from app import models

app = FastAPI(title="Bus Service")

Base.metadata.create_all(bind=engine)

app.include_router(routes.router)


@app.get("/")
def root():
    return {
        "message": "Bus Service is running"
    }