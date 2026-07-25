INSERT INTO menu_items (item_name, category, price, available)
VALUES
('Chicken Biryani', 'Lunch', 250.00, TRUE),
('Cold Coffee', 'Beverages', 150.00, TRUE),
('Zinger Burger', 'Fast Food', 300.00, FALSE);

INSERT INTO inventory (item_name, quantity, status)
VALUES
('Chicken Biryani', 20, 'Available'),
('Cold Coffee', 3, 'Low Stock'),
('Zinger Burger', 0, 'Out of Stock');

SELECT * FROM menu_items;
SELECT * FROM inventory;