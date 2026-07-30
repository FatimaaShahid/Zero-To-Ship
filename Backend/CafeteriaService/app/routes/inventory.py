from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud, schemas

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Inventory Item
@router.post("/", response_model=schemas.InventoryResponse)
def create_inventory(
    inventory: schemas.InventoryCreate,
    db: Session = Depends(get_db)
):
    return crud.create_inventory(db, inventory)


# Get All Inventory Items
@router.get("/", response_model=list[schemas.InventoryResponse])
def read_inventory(
    db: Session = Depends(get_db)
):
    return crud.get_inventory(db)


# Get Inventory Item by ID
@router.get("/{inventory_id}", response_model=schemas.InventoryResponse)
def read_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    inventory = crud.get_inventory_item(db, inventory_id)

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found"
        )

    return inventory


# Update Inventory Item
@router.patch("/{inventory_id}", response_model=schemas.InventoryResponse)
def update_inventory(
    inventory_id: int,
    inventory: schemas.InventoryUpdate,
    db: Session = Depends(get_db)
):
    updated = crud.update_inventory(
        db,
        inventory_id,
        inventory
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found"
        )

    return updated


# Delete Inventory Item
@router.delete("/{inventory_id}")
def delete_inventory(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_inventory(
        db,
        inventory_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found"
        )

    return {
        "message": "Inventory item deleted successfully"
    }