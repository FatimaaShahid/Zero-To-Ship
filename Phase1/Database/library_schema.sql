CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(50),
    total_copies INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    available_copies INT NOT NULL DEFAULT 1 CHECK (available_copies >= 0)
);

CREATE TABLE checkouts (
    checkout_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(book_id),
    user_id INT NOT NULL,                    -- logical ref to user_db.users, no physical FK
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'Checked Out'
        CHECK (status IN ('Checked Out', 'Returned', 'Overdue'))
);

CREATE INDEX idx_checkouts_user ON checkouts(user_id);
CREATE INDEX idx_checkouts_book ON checkouts(book_id);