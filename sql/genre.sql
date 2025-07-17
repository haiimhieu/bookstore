-- API call to get all books from a genre based on the id
SELECT 
	b.book_id, 
	b.title, 
	b.author, 
	b.price, 
	b.image_url,
	g.name as genre,
	AVG(r.rating) as avg_rating
FROM books as b
LEFT JOIN genre as g ON b.genre_id = g.genre_id
LEFT JOIN reviews as r ON b.book_id = r.book_id
WHERE b.genre_id = ? 
GROUP BY b.book_id
ORDER BY ${sortByQuery}
LIMIT ? OFFSET ?;

-- API call to get all genre
SELECT
	genre_id, name
FROM genre

-- API to get the genre name based on the id
SELECT
	name
FROM genre
WHERE genre_id = ?