from sqlalchemy import Column, Integer, String

from app.database import Base


class BusRoute(Base):
    __tablename__ = "bus_routes"

    route_id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String(100), nullable=False)
    start_location = Column(String(100), nullable=False)
    end_location = Column(String(100), nullable=False)