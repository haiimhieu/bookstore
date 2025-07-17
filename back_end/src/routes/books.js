import { Router } from "express";
const router = Router()
import db from '../utils/dbconfig.js';

// API call to get all the books in the database
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 26;
  const sortBy = parseInt(req.query.sortBy) || 1;
  const offset = (page - 1) * limit;
  let sortByQuery = "b.title ASC"
  if (sortBy == 1) {
    sortByQuery = "b.title ASC"
  } else if (sortBy == 2) {
    sortByQuery = "b.title DESC"
  } else if (sortBy == 3) {
    sortByQuery = "b.price ASC"
  } else if (sortBy == 4) {
    sortByQuery = "b.price DESC"
  } else if (sortBy == 5) {
    sortByQuery = "avg_rating DESC"
  } else if (sortBy == 6) {
    sortByQuery = "avg_rating ASC"
  }

  const sql = `
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
    ORDER by ${sortByQuery}
    LIMIT ? OFFSET ?;
  `;

  db.query(sql, [limit, offset,], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching books');
    }
    res.json(results);
  });
});

// API call to get all results for a search query
router.get('/search', (req, res) => {
  const searchQuery = req.query.searchQuery || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 26;
  const sortBy = parseInt(req.query.sortBy) || 1;
  const offset = (page - 1) * limit;
  let whereQuery = `b.title LIKE '%${searchQuery}%'`
  if (sortBy == 1) {
    whereQuery = `b.title LIKE '%${searchQuery}%' OR b.author LIKE '%${searchQuery}%'`
  } else if (sortBy == 2) {
    whereQuery = `b.title LIKE '%${searchQuery}%'`
  } else if (sortBy == 3) {
    whereQuery = `b.author LIKE '%${searchQuery}%'`
  }

  const sql = `
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
  `;

  db.query(sql, [limit, offset,], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching books');
    }
    res.json(results);
  });
})

// API call to get all details of one book based on the book_id
router.get('/:bookId', (req, res) => {
  const { bookId } = req.params;

  const sql = `
        SELECT b.*, g.name AS genre
        FROM books b
        JOIN genre g ON b.genre_id = g.genre_id
        WHERE b.book_id = ?
    `;

  db.query(sql, [bookId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(results[0]);
  });
});



export default router;