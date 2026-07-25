CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150),
    category VARCHAR(100),
    available_copies INT NOT NULL CHECK(available_copies >= 0),
    total_copies INT NOT NULL CHECK(total_copies >= available_copies)
);