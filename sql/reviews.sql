-- API call the reviews table
-- API call to get all orders
SELECT 
	r.review_id, 
	r.rating, 
	r.content, 
	r.created_at, 
	u.username
FROM reviews r
JOIN users u ON r.user_id = u.user_id
WHERE r.book_id = ?
ORDER BY r.created_at DESC;

-- API call to get average rating of a book
SELECT AVG(rating) as avg_rating
FROM reviews
WHERE book_id = ?;

-- API call to see if a user has already left a review 
SELECT * FROM reviews WHERE user_id = ? AND book_id = ?;

-- API call to update the review
UPDATE reviews SET rating = ?, content = ?, created_at = NOW() WHERE user_id = ? AND book_id = ?;

-- API call to create a review
INSERT INTO reviews (user_id, book_id, rating, content) VALUES (?, ?, ?, ?);

-- API call to delete a review
DELETE FROM reviews WHERE user_id = ? AND book_id = ?
