import { Router } from "express";
const router = Router()
import db from '../utils/dbconfig.js';
import bcrypt from 'bcrypt';

router.get("/me", (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ loggedIn: false, message: 'Server error' });
        }
        if (results.length === 0) {
            return res.json({ loggedIn: false });
        }
        const user = results[0];

        bcrypt.compare(password, user.password_hash, (hashErr, valid) => {
            if (hashErr) {
                console.error('bcrypt error:', hashErr);
                return res.status(500).json({ loggedIn: false, message: 'Server error' });
            }
            if (!valid) {
                return res.json({ loggedIn: false });
            }
            req.session.user = {
                id: user.user_id,
                username: user.username,
                isAdmin: user.is_admin,
            };
            res.json({ loggedIn: true, user: req.session.user });
        });
    });
});

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    db.query(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, username],
        (err, results) => {
            if (err) {
                console.error('DB error:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length) {
                return res.status(409).json({ message: 'Username or email already in use' });
            }

            bcrypt.hash(password, 10, (hashErr, password_hash) => {
                if (hashErr) {
                    console.error('Hashing error:', hashErr);
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                db.query(
                    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                    [username, email, password_hash],
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Insert error:', insertErr);
                            return res.status(500).json({ message: 'Server error' });
                        }

                        res.status(201).json({ message: 'User created' });
                    }
                );
            });
        }
    );
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // or your session cookie name
        res.json({ message: 'Logged out successfully' });
    });
});

export default router;