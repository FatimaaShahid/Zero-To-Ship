from fastapi import FastAPI

from app.database import Base, engine
from app.routes import menu, inventory

app = FastAPI(title="Cafeteria Service")

# Create tables (only if they don't already exist)
Base.metadata.create_all(bind=engine)

app.include_router(menu.router)
app.include_router(inventory.router)