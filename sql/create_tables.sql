-- DROP DATABASE IF EXISTS `bookstore`;
-- CREATE DATABASE `bookstore`;
-- USE `bookstore`;

-- CREATE TABLE Genre (
-- 	genre_id INT UNSIGNED AUTO_INCREMENT,
--     name varchar(50) NOT NULL,
--     primary key (genre_id)
-- );

-- INSERT INTO genre (genre_id, name) 
-- VALUES
-- (1, 'Romance'),
-- (2, 'Mystery'),
-- (3, 'Thriller'),
-- (4, 'Fantasy'),
-- (5, 'Horror'),
-- (6, 'Action/Adventure'),
-- (7, 'Fiction'),
-- (8, 'Children'),
-- (9, 'Non-Fiction');


-- CREATE TABLE Books (
-- 	book_id SERIAL,
--     title varchar(255) NOT NULL,
--     author varchar(255) NOT NULL,
--     genre_id int unsigned NOT NULL,
--     price decimal(10, 2) NOT NULL,
--     stock_quantity int DEFAULT 0,
--     PRIMARY KEY (book_id),
--     foreign key (genre_id) references Genre(genre_id)
-- )

-- CREATE TABLE Users (
-- user_id SERIAL,
-- username VARCHAR(50) NOT NULL UNIQUE,
-- email VARCHAR(100) NOT NULL UNIQUE,
-- password_hash TEXT NOT NULL,
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- PRIMARY KEY (user_id)
-- )

CREATE TABLE reviews (
	review_id SERIAL,
    user_id BIGINT UNSIGNED NOT NULL,
    book_id BIGINT UNSIGNED NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
    )