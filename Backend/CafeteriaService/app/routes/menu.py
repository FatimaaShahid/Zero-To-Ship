from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud, schemas

router = APIRouter(
    prefix="/menu",
    tags=["Menu"]
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Menu Item
@router.post("/", response_model=schemas.MenuItemResponse)
def create_menu(
    menu: schemas.MenuItemCreate,
    db: Session = Depends(get_db)
):
    return crud.create_menu_item(db, menu)


# Get All Menu Items
@router.get("/", response_model=list[schemas.MenuItemResponse])
def read_menu(
    db: Session = Depends(get_db)
):
    return crud.get_menu_items(db)


# Get Menu Item by ID
@router.get("/{item_id}", response_model=schemas.MenuItemResponse)
def read_menu_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    menu = crud.get_menu_item(db, item_id)

    if not menu:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return menu


# Update Menu Item
@router.patch("/{item_id}", response_model=schemas.MenuItemResponse)
def update_menu(
    item_id: int,
    menu: schemas.MenuItemUpdate,
    db: Session = Depends(get_db)
):
    updated = crud.update_menu_item(
        db,
        item_id,
        menu
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return updated


# Delete Menu Item
@router.delete("/{item_id}")
def delete_menu(
    item_id: int,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_menu_item(
        db,
        item_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return {
        "message": "Menu item deleted successfully"
    }