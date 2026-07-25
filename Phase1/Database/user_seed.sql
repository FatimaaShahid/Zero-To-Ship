INSERT INTO users (full_name, email, password_hash, role)
VALUES
('Abdul Moazzim', 'abdul@neduet.edu.pk', 'hashed_password_1', 'student'),
('Fatima Shahid', 'fatima@neduet.edu.pk', 'hashed_password_2', 'student'),
('Dr. Ahmed Khan', 'ahmed@neduet.edu.pk', 'hashed_password_3', 'faculty'),
('System Admin', 'admin@neduet.edu.pk', 'hashed_password_4', 'admin');

SELECT * FROM users;