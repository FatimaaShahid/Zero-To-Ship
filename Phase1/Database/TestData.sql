-- -- =========================================================
-- -- Sentinel-Sync Phase 1 — Manual Test Seed
-- -- Run each block against its own isolated container.
-- -- Purpose: confirm constraints, uniqueness, and checks fire
-- -- correctly BEFORE any backend logic touches these tables.
-- -- =========================================================

-- -- ---------------------------------------------------------
-- -- user_db  (connect: psql -h localhost -p 5433 -U postgres -d user_db)
-- -- ---------------------------------------------------------
-- INSERT INTO users (full_name, email, password_hash, role) VALUES
--     ('Abdul Moazzim', 'abdul@neduet.edu.pk', 'hashed_placeholder_1', 'student'),
--     ('Fatima Shahid', 'fatima@neduet.edu.pk', 'hashed_placeholder_2', 'student'),
--     ('Café Staff One', 'staff.cafe@neduet.edu.pk', 'hashed_placeholder_3', 'staff'),
--     ('System Admin', 'admin@neduet.edu.pk', 'hashed_placeholder_4', 'admin');

-- -- Verify: duplicate email must fail (UNIQUE constraint)
-- -- Expect: ERROR - duplicate key value violates unique constraint
-- -- INSERT INTO users (full_name, email, password_hash)
-- -- VALUES ('Duplicate Test', 'abdul@neduet.edu.pk', 'x');

-- -- Verify: invalid role must fail (CHECK constraint)
-- -- Expect: ERROR - violates check constraint "users_role_check"
-- -- INSERT INTO users (full_name, email, password_hash, role)
-- -- VALUES ('Bad Role', 'bad@neduet.edu.pk', 'x', 'superuser');

-- SELECT * FROM users;


-- -- ---------------------------------------------------------
-- -- cafeteria_db  (connect: psql -h localhost -p 5434 -U postgres -d cafeteria_db)
-- -- ---------------------------------------------------------
-- INSERT INTO menu_items (item_name, category, price, available) VALUES
--     ('Chicken Biryani', 'Lunch', 250.00, TRUE),
--     ('Cold Coffee', 'Beverages', 150.00, TRUE),
--     ('Zinger Burger', 'Fast Food', 300.00, FALSE);

-- INSERT INTO inventory (item_name, quantity, status) VALUES
--     ('Chicken Biryani', 20, 'Available'),
--     ('Cold Coffee', 3, 'Low Stock'),
--     ('Zinger Burger', 0, 'Out of Stock');

-- -- Verify: negative price must fail (CHECK constraint)
-- -- Expect: ERROR - violates check constraint "menu_items_price_check"
-- -- INSERT INTO menu_items (item_name, price) VALUES ('Free Item', -10.00);

-- -- Verify: negative quantity must fail
-- -- Expect: ERROR - violates check constraint "inventory_quantity_check"
-- -- INSERT INTO inventory (item_name, quantity, status) VALUES ('Bad Item', -5, 'Available');

-- -- Verify: invalid status must fail
-- -- Expect: ERROR - violates check constraint "inventory_status_check"
-- -- INSERT INTO inventory (item_name, quantity, status) VALUES ('Bad Item', 5, 'Expired');

-- SELECT * FROM menu_items;
-- SELECT * FROM inventory;


-- -- ---------------------------------------------------------
-- -- library_db  (connect: psql -h localhost -p 5435 -U postgres -d library_db)
-- -- ---------------------------------------------------------
-- INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
--     ('Clean Code', 'Robert C. Martin', '978-0-13-235088-4', 'Software Engineering', 3, 3),
--     ('Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1-4493-7332-0', 'Distributed Systems', 2, 2),
--     ('Untitled Manuscript', NULL, NULL, 'Archive', 1, 1);  -- confirms NULL isbn is allowed

-- -- Manual checkout: references user_id=1 (Abdul) from user_db — logical FK, not enforced by Postgres
-- INSERT INTO checkouts (book_id, user_id, due_date) VALUES
--     (1, 1, CURRENT_TIMESTAMP + INTERVAL '14 days');

-- -- Verify: duplicate ISBN must fail (UNIQUE constraint)
-- -- Expect: ERROR - duplicate key value violates unique constraint
-- -- INSERT INTO books (title, isbn) VALUES ('Duplicate ISBN Test', '978-0-13-235088-4');

-- -- Verify: invalid checkout status must fail
-- -- Expect: ERROR - violates check constraint "checkouts_status_check"
-- -- INSERT INTO checkouts (book_id, user_id, due_date, status)
-- -- VALUES (1, 1, CURRENT_TIMESTAMP, 'Lost Forever');

-- -- Manual cross-check (no live FK): confirm checkouts.user_id=1 actually
-- -- exists in user_db.users by re-running SELECT * FROM users; there and
-- -- comparing manually.

-- SELECT * FROM books;
-- SELECT * FROM checkouts;


-- -- ---------------------------------------------------------
-- -- bus_db  (connect: psql -h localhost -p 5436 -U postgres -d bus_db)
-- -- ---------------------------------------------------------
-- INSERT INTO routes (route_name, start_point, end_point) VALUES
--     ('Route A', 'Main Campus', 'North Nazimabad'),
--     ('Route B', 'Main Campus', 'Gulshan-e-Iqbal');

-- INSERT INTO buses (bus_number, route_id, capacity, status) VALUES
--     ('NED-BUS-01', 1, 45, 'Active'),
--     ('NED-BUS-02', 2, 45, 'Maintenance');

-- INSERT INTO bus_locations (bus_id, latitude, longitude) VALUES
--     (1, 24.932500, 67.113100);

-- -- Verify: capacity must be positive
-- -- Expect: ERROR - violates check constraint "buses_capacity_check"
-- -- INSERT INTO buses (bus_number, route_id, capacity) VALUES ('BAD-BUS', 1, 0);

-- -- Verify: invalid bus status must fail
-- -- Expect: ERROR - violates check constraint "buses_status_check"
-- -- INSERT INTO buses (bus_number, route_id, capacity, status)
-- -- VALUES ('BAD-BUS-2', 1, 40, 'On Strike');

-- -- Verify: route_id foreign key enforced (same DB, real FK)
-- -- Expect: ERROR - violates foreign key constraint
-- -- INSERT INTO buses (bus_number, route_id, capacity) VALUES ('BAD-BUS-3', 999, 40);

-- SELECT * FROM routes;
-- SELECT * FROM buses;
-- SELECT * FROM bus_locations;


-- -- ---------------------------------------------------------
-- -- notification_db  (connect: psql -h localhost -p 5438 -U postgres -d notification_db)
-- -- ---------------------------------------------------------
-- -- user_id=1 references user_db.users — logical FK, not enforced by Postgres
-- INSERT INTO notifications (user_id, title, message, type) VALUES
--     (1, 'Book Due Soon', 'Clean Code is due in 3 days.', 'reminder'),
--     (1, 'Route B Delayed', 'Bus NED-BUS-02 is under maintenance today.', 'alert'),
--     (2, 'Welcome to Sentinel-Sync', 'Your account has been created.', 'info');

-- -- Verify: invalid type must fail
-- -- Expect: ERROR - violates check constraint "notifications_type_check"
-- -- INSERT INTO notifications (user_id, title, message, type)
-- -- VALUES (1, 'Bad Type', 'x', 'urgent_siren');

-- SELECT * FROM notifications;


-- -- =========================================================
-- -- Manual verification checklist (tick off by hand):
-- -- [ ] users.email UNIQUE fires on duplicate insert
-- -- [ ] users.role CHECK rejects invalid values
-- -- [ ] menu_items.price CHECK rejects negative values
-- -- [ ] inventory.quantity CHECK rejects negative values
-- -- [ ] inventory.status CHECK rejects invalid values
-- -- [ ] books.isbn UNIQUE fires on duplicate, allows multiple NULLs
-- -- [ ] checkouts.status CHECK rejects invalid values
-- -- [ ] checkouts.user_id manually cross-checked against user_db.users
-- -- [ ] buses.capacity CHECK rejects non-positive values
-- -- [ ] buses.status CHECK rejects invalid values
-- -- [ ] buses.route_id FK rejects non-existent route (real FK, same DB)
-- -- [ ] notifications.type CHECK rejects invalid values
-- -- [ ] notifications.user_id manually cross-checked against user_db.users
-- -- =========================================================