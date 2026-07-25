import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

pubsub = r.pubsub()

pubsub.subscribe("equipment.updated")

print("Listening for events...")

for message in pubsub.listen():
    if message["type"] == "message":
        print(f"Received: {message['data']}")