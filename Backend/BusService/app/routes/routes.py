import json
import os

import redis
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import SessionLocal

load_dotenv()

# Redis Connection
r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    decode_responses=True
)

router = APIRouter(
    prefix="/routes",
    tags=["Bus Routes"]
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Route
@router.post("/", response_model=schemas.BusRouteResponse)
def create_route(
    route: schemas.BusRouteCreate,
    db: Session = Depends(get_db)
):
    new_route = crud.create_route(db, route)

    event = {
        "event": "route.created",
        "route_id": new_route.route_id,
        "route_name": new_route.route_name
    }

    r.publish("route.created", json.dumps(event))

    return new_route


# Get All Routes
@router.get("/", response_model=list[schemas.BusRouteResponse])
def get_routes(
    db: Session = Depends(get_db)
):
    return crud.get_routes(db)


# Get Route By ID
@router.get("/{route_id}", response_model=schemas.BusRouteResponse)
def get_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    route = crud.get_route(db, route_id)

    if not route:
        raise HTTPException(
            status_code=404,
            detail="Route not found"
        )

    return route


# Update Route
@router.patch("/{route_id}", response_model=schemas.BusRouteResponse)
def update_route(
    route_id: int,
    updated_route: schemas.BusRouteUpdate,
    db: Session = Depends(get_db)
):
    route = crud.update_route(
        db,
        route_id,
        updated_route
    )

    if not route:
        raise HTTPException(
            status_code=404,
            detail="Route not found"
        )

    event = {
        "event": "route.updated",
        "route_id": route.route_id
    }

    r.publish("route.updated", json.dumps(event))

    return route


# Delete Route
@router.delete("/{route_id}")
def delete_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    route = crud.delete_route(db, route_id)

    if not route:
        raise HTTPException(
            status_code=404,
            detail="Route not found"
        )

    event = {
        "event": "route.deleted",
        "route_id": route_id
    }

    r.publish("route.deleted", json.dumps(event))

    return {
        "message": "Route deleted successfully"
    }