-- API call to get all the books in the database with genre
SELECT 
  b.book_id,
  b.title,
  b.author,
  b.price,
  b.image_url,
  g.name AS genre,
  AVG(r.rating) as avg_rating
FROM Books b
LEFT JOIN Genre g ON b.genre_id = g.genre_id
LEFT JOIN reviews as r ON b.book_id = r.book_id
GROUP BY b.book_id, b.title, b.author, b.price, g.name
ORDER by avg_rating ASC
LIMIT ? OFFSET ?;
    
-- API call to get results from a search query
SELECT 
  b.book_id,
  b.title,
  b.author,
  b.price,
  b.image_url,
  g.name AS genre,
  AVG(r.rating) AS avg_rating
FROM Books b
LEFT JOIN Genre g ON b.genre_id = g.genre_id
LEFT JOIN reviews r ON b.book_id = r.book_id
WHERE ${whereQuery}
GROUP BY b.book_id
ORDER by b.title ASC
LIMIT ? OFFSET ?;
    
-- API call to get details of one book
SELECT b.*, g.name AS genre
FROM books b
JOIN genre g ON b.genre_id = g.genre_id
WHERE b.book_id = ?

