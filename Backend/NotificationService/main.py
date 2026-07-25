from fastapi import FastAPI
import redis
import json
import threading

app = FastAPI(title="Notification Service")

# Connect to Redis
r = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


def listen_for_events():
    pubsub = r.pubsub()
    pubsub.subscribe("menu.updated")

    print("Listening for menu updates...")

    for message in pubsub.listen():
        if message["type"] == "message":
            event = json.loads(message["data"])

            print("\n===== NEW EVENT =====")
            print(event)
            print("=====================\n")


@app.on_event("startup") #this whole line runs the code below before the server starts
def startup():
    thread = threading.Thread(target=listen_for_events)
    thread.daemon = True
    thread.start()