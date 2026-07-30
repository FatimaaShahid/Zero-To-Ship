import json

from app.redis_client import redis_client


def publish_event(channel: str, event: dict):

    redis_client.publish(
        channel,
        json.dumps(event)
    )