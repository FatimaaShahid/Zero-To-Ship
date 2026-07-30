from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DECIMAL
)

from app.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    category = Column(String(50))
    price = Column(DECIMAL(8, 2), nullable=False)
    available = Column(Boolean, default=True)

class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String(30))