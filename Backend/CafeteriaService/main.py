from fastapi import FastAPI
from pydantic import BaseModel
import redis
import json

app = FastAPI(title="Cafeteria Service")

# Connect to Redis
r = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


class Menu(BaseModel):
    day: str
    meal: str
    price: int


@app.post("/menu/update")
def update_menu(menu: Menu):

    event = {
        "event": "menu.updated",
        "day": menu.day,
        "meal": menu.meal,
        "price": menu.price
    }

    r.publish("menu.updated", json.dumps(event))

    return {
        "message": "Menu updated successfully",
        "published_event": event
    }