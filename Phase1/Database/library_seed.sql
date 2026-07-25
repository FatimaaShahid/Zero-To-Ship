INSERT INTO books
(title, author, category, available_copies, total_copies)
VALUES
('Clean Code',
'Robert C. Martin',
'Software Engineering',
3,
3),

('Designing Data-Intensive Applications',
'Martin Kleppmann',
'Distributed Systems',
2,
2),

('Computer Networks',
'Andrew S. Tanenbaum',
'Networking',
5,
5);

SELECT * FROM books;