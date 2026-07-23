# Sentinel-Sync — API Contract

This contract maps every route each microservice will expose, agreed on **before** implementation
begins, so the frontend (Phase 4) and each backend (Phase 2) build against the same shape and
don't drift apart mid-project.

**Status:** Routes below are *contracted*, not yet implemented. Phase 1 only covers schema +
containers. Implementation starts Phase 2.

**Cross-service rule:** No service calls another service's database directly. Any field like
`user_id` appearing in a non-`user-service` table is a **logical reference** — validated by
calling `user-service`'s API (or later, listening to its events), never by a DB-level foreign key.

---

## user-service
DB: `user_db`

| Method | Route | Payload | Response |
|---|---|---|---|
| POST | `/users/register` | `{ full_name, email, password, role? }` | `201 { user_id, full_name, email, role }` |
| POST | `/users/login` | `{ email, password }` | `200 { token, user_id, role }` |
| GET | `/users/:id` | — | `200 { user_id, full_name, email, role, created_at }` |
| PATCH | `/users/:id` | `{ full_name?, role? }` | `200 { updated record }` |

**Notes:** `role` defaults to `student` if omitted. Only `admin` role may set `role` to `faculty`/`admin` on register or patch — enforced in Phase 2 logic, not by the DB.

---

## cafeteria-service
DB: `cafeteria_db`

| Method | Route | Payload | Response |
|---|---|---|---|
| GET | `/cafeteria/menu` | — | `200 [ { item_id, item_name, category, price, available } ]` |
| GET | `/cafeteria/menu/:id` | — | `200 { item_id, item_name, category, price, available } ` |
| PATCH | `/cafeteria/menu/:id` | `{ price?, available? }` | `200 { updated record }` |
| GET | `/cafeteria/inventory` | — | `200 [ { inventory_id, item_name, quantity, status } ]` |
| PATCH | `/cafeteria/inventory/:id` | `{ quantity?, status? }` | `200 { updated record }` |

**Notes:** `PATCH` routes restricted to `role: staff` or `admin` (validated against `user-service`). `status` auto-derives from `quantity` in Phase 2 logic (e.g. `quantity = 0 → 'Out of Stock'`) but stays a stored column so reads don't need to recompute it every request.

---

## library-service
DB: `library_db`

| Method | Route | Payload | Response |
|---|---|---|---|
| GET | `/library/books` | — | `200 [ { book_id, title, author, isbn, category, available_copies } ]` |
| GET | `/library/books/:id` | — | `200 { full book record }` |
| POST | `/library/checkout` | `{ book_id, user_id }` | `201 { checkout_id, due_date }` |
| PATCH | `/library/checkout/:id/return` | — | `200 { checkout_id, return_date, status: 'Returned' }` |
| GET | `/library/checkouts/user/:user_id` | — | `200 [ { checkout records for that user } ]` |

**Notes:** `POST /checkout` decrements `available_copies` and inserts into `checkouts` in one transaction. Rejects if `available_copies = 0`. `user_id` validated against `user-service`, not a physical FK.

---

## bus-service
DB: `bus_db`

| Method | Route | Payload | Response |
|---|---|---|---|
| GET | `/bus/routes` | — | `200 [ { route_id, route_name, start_point, end_point } ]` |
| GET | `/bus/buses` | — | `200 [ { bus_id, bus_number, route_id, status } ]` |
| GET | `/bus/buses/:id/location` | — | `200 { bus_id, latitude, longitude, updated_at }` |
| POST | `/bus/buses/:id/location` | `{ latitude, longitude }` | `201 { location_id, updated_at }` |

**Notes:** `POST /location` intended for a driver-facing app or manual staff update in this scope — no live GPS device integration for the summer project. Only the latest row per `bus_id` is read for display; older rows are history.

---

## notification-service
DB: `notification_db`

| Method | Route | Payload | Response |
|---|---|---|---|
| GET | `/notifications/user/:user_id` | — | `200 [ { notification_id, title, message, type, is_read, created_at } ]` |
| POST | `/notifications` | `{ user_id, title, message, type? }` | `201 { notification_id }` |
| PATCH | `/notifications/:id/read` | — | `200 { notification_id, is_read: true }` |

**Notes:** In Phase 2, this service is called directly. From Phase 3 onward, other services publish an event (e.g. `cafeteria.low_stock`) and `notification-service` subscribes and creates the row itself — the route contract above doesn't change either way.

---

## Deferred to later phases (not seeded in Phase 1)

- **ai-faq-service** (`chatbot_db`, pgvector) — Phase 3. Routes TBD once retrieval design is finalized.
- **event-bus** (`event_db`, `event_logs` table) — Phase 2/3, once services start publishing.
