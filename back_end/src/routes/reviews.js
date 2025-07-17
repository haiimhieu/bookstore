import { Router } from 'express';
import db from '../utils/dbconfig.js';

const router = Router();

// API call to get all the reviews of one book based on the id
router.get('/book/:bookId', (req, res) => {
    const { bookId } = req.params;

    const sql = `
        SELECT 
            r.review_id, 
            r.rating, 
            r.content, 
            r.created_at, 
            u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.book_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [bookId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err });

        res.json(results);
    });
});

// API call to get the average rating of one book based on the id
router.get('/book/getAverage/:bookId', (req, res) => {
    const { bookId } = req.params;

    const sql = `
    SELECT AVG(rating) as avg_rating
    FROM reviews
    WHERE book_id = ?
    `;

    db.query(sql, [bookId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err });
        res.send(results[0].avg_rating);
    })
})

// API call to add or update reviews
router.post('/addOrUpdate', (req, res) => {
    const { user_id, book_id, rating, content } = req.body;

    if (!user_id || !book_id || !rating || !content) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    db.query(
        'SELECT * FROM reviews WHERE user_id = ? AND book_id = ?',
        [user_id, book_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error.' });

            if (results.length > 0) {
                // Update existing review
                db.query(
                    'UPDATE reviews SET rating = ?, content = ?, created_at = NOW() WHERE user_id = ? AND book_id = ?',
                    [rating, content, user_id, book_id],
                    (err2) => {
                        if (err2) return res.status(500).json({ message: 'Update failed.' });
                        res.status(200).json({ message: 'Review updated.' });
                    }
                );
            } else {
                // Insert new review
                db.query(
                    'INSERT INTO reviews (user_id, book_id, rating, content) VALUES (?, ?, ?, ?)',
                    [user_id, book_id, rating, content],
                    (err3) => {
                        if (err3) return res.status(500).json({ message: 'Insert failed.' });
                        res.status(201).json({ message: 'Review created.' });
                    }
                );
            }
        }
    );
});

// API call to delete a review
router.delete('/delete', (req, res) => {
    const { user_id, book_id } = req.body;

    if (!user_id || !book_id) {
        return res.status(400).json({ message: 'Missing user or book ID.' });
    }

    db.query(
        'DELETE FROM reviews WHERE user_id = ? AND book_id = ?',
        [user_id, book_id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Delete failed.' });
            res.status(200).json({ message: 'Review deleted.' });
        }
    );
});

export default router;