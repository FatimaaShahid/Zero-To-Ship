from sqlalchemy.orm import Session
from app.event_publisher import publish_event
from app import models, schemas

def create_menu_item(db: Session, menu: schemas.MenuItemCreate):

    db_menu = models.MenuItem(
        item_name=menu.item_name,
        category=menu.category,
        price=menu.price,
        available=menu.available
    )

    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    publish_event(
    "menu.created",
    {
        "event": "menu.created",
        "item_id": db_menu.item_id,
        "item_name": db_menu.item_name,
        "category": db_menu.category,
        "price": float(db_menu.price),
        "available": db_menu.available
    }
)

    return db_menu

def get_menu_items(db: Session):

    return db.query(models.MenuItem).all()

def get_menu_item(db: Session, item_id: int):

    return (
        db.query(models.MenuItem)
        .filter(models.MenuItem.item_id == item_id)
        .first()
    )

def update_menu_item(
    db: Session,
    item_id: int,
    menu: schemas.MenuItemUpdate
):

    db_menu = get_menu_item(db, item_id)

    if not db_menu:
        return None

    update_data = menu.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_menu, key, value)

    db.commit()
    db.refresh(db_menu)
    publish_event(
    "menu.updated",
    {
        "event": "menu.updated",
        "item_id": db_menu.item_id,
        "item_name": db_menu.item_name,
        "category": db_menu.category,
        "price": float(db_menu.price),
        "available": db_menu.available
    }
)

    return db_menu

def delete_menu_item(
    db: Session,
    item_id: int
):

    db_menu = get_menu_item(db, item_id)

    if not db_menu:
        return None
    event = {
    "event": "menu.deleted",
    "item_id": db_menu.item_id,
    "item_name": db_menu.item_name
}

    db.delete(db_menu)
    db.commit()
    publish_event(
    "menu.deleted",
    event
)

    return db_menu

def create_inventory(
    db: Session,
    inventory: schemas.InventoryCreate
):

    db_inventory = models.Inventory(**inventory.model_dump())

    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    publish_event(
    "inventory.created",
    {
        "event": "inventory.created",
        "inventory_id": db_inventory.inventory_id,
        "item_name": db_inventory.item_name,
        "quantity": db_inventory.quantity,
        "status": db_inventory.status
    }
)

    return db_inventory

def get_inventory(db: Session):

    return db.query(models.Inventory).all()

def get_inventory_item(
    db: Session,
    inventory_id: int
):

    return (
        db.query(models.Inventory)
        .filter(
            models.Inventory.inventory_id == inventory_id
        )
        .first()
    )
def update_inventory(
    db: Session,
    inventory_id: int,
    inventory: schemas.InventoryUpdate
):
    db_inventory = get_inventory_item(db, inventory_id)

    if not db_inventory:
        return None

    update_data = inventory.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_inventory, key, value)

    db.commit()
    db.refresh(db_inventory)
    publish_event(
    "inventory.updated",
    {
        "event": "inventory.updated",
        "inventory_id": db_inventory.inventory_id,
        "item_name": db_inventory.item_name,
        "quantity": db_inventory.quantity,
        "status": db_inventory.status
    }
)

    return db_inventory

def delete_inventory(
    db: Session,
    inventory_id: int
):
    db_inventory = get_inventory_item(db, inventory_id)

    if not db_inventory:
        return None
    event = {
    "event": "inventory.deleted",
    "inventory_id": db_inventory.inventory_id,
    "item_name": db_inventory.item_name
}

    db.delete(db_inventory)
    db.commit()
    publish_event(
    "inventory.deleted",
    event
)

    return db_inventory