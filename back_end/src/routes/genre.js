import db from "../utils/dbconfig.js";
import { Router } from "express";
const router = Router();

// API call to get all books from a certain genre
router.get('/', (req, res) => {
    const genreId = parseInt(req.query.genreId) || 1
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 26;
    const offset = (page - 1) * limit;
    const sortBy = parseInt(req.query.sortBy) || 1;
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

    const sqlStatement = `
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
    `;
    db.query(sqlStatement, [genreId, limit, offset], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching books for genre');
        }
        res.json(results);
    })
});

// API call to get all genre for navigation menu dropdown
router.get('/getAllGenre', (req, res) => {
    const sqlStatement = `
    SELECT
        genre_id, name
    FROM genre
    `;

    db.query(sqlStatement, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching all genres')
        }
        res.json(results);
    })
});

// API call to get a specific genre based on id
router.get('/getGenre', (req, res) => {
    const genreId = parseInt(req.query.genreId) || 1;
    const sqlStatement = `
    SELECT
        name
    FROM genre
    WHERE genre_id = ?
    `;

    db.query(sqlStatement, [genreId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching genre')
        }
        res.send(results[0].name);
    })
})


export default router;