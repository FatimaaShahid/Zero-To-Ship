CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(8,2) NOT NULL CHECK(price >= 0),
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK(quantity >= 0),
    status VARCHAR(30)
        CHECK(status IN ('Available','Low Stock','Out of Stock'))
);

CREATE INDEX idx_menu_name
ON menu_items(item_name);