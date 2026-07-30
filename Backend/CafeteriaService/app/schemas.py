from pydantic import BaseModel
from decimal import Decimal

class MenuItemCreate(BaseModel):
    item_name: str
    category: str | None = None
    price: Decimal
    available: bool = True

class MenuItemUpdate(BaseModel):
    item_name: str | None = None
    category: str | None = None
    price: Decimal | None = None
    available: bool | None = None

class MenuItemResponse(BaseModel):
    item_id: int
    item_name: str
    category: str | None
    price: Decimal
    available: bool

    class Config:
        from_attributes = True

class InventoryCreate(BaseModel):
    item_name: str
    quantity: int
    status: str

class InventoryUpdate(BaseModel):
    item_name: str | None = None
    quantity: int | None = None
    status: str | None = None

class InventoryResponse(BaseModel):
    inventory_id: int
    item_name: str
    quantity: int
    status: str

    class Config:
        from_attributes = True