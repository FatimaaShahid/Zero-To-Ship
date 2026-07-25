import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

message = "Equipment #15 status changed to Maintenance"

r.publish("equipment.updated", message)

print("Event published!")