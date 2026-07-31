from pydantic import BaseModel


class BusRouteCreate(BaseModel):
    route_name: str
    start_location: str
    end_location: str


class BusRouteUpdate(BaseModel):
    route_name: str
    start_location: str
    end_location: str


class BusRouteResponse(BaseModel):
    route_id: int
    route_name: str
    start_location: str
    end_location: str

    class Config:
        from_attributes = True