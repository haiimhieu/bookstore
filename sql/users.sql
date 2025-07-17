-- API call to check for a user
SELECT * FROM users WHERE username = ?;

-- API call to add a user to the table
INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)