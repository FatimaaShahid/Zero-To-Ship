from sqlalchemy.orm import Session

from app import models, schemas


# Create Bus Route
def create_route(db: Session, route: schemas.BusRouteCreate):
    db_route = models.BusRoute(**route.model_dump())

    db.add(db_route)
    db.commit()
    db.refresh(db_route)

    return db_route


# Get All Routes
def get_routes(db: Session):
    return db.query(models.BusRoute).all()


# Get Route by ID
def get_route(db: Session, route_id: int):
    return (
        db.query(models.BusRoute)
        .filter(models.BusRoute.route_id == route_id)
        .first()
    )


# Update Route
def update_route(
    db: Session,
    route_id: int,
    updated_route: schemas.BusRouteUpdate
):
    db_route = get_route(db, route_id)

    if not db_route:
        return None

    for key, value in updated_route.model_dump().items():
        setattr(db_route, key, value)

    db.commit()
    db.refresh(db_route)

    return db_route


# Delete Route
def delete_route(db: Session, route_id: int):
    db_route = get_route(db, route_id)

    if not db_route:
        return None

    db.delete(db_route)
    db.commit()

    return db_route