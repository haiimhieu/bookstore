import express from 'express';
import db from "../utils/dbconfig.js";

const router = express.Router();

// API call to get all orders and orders items
router.get('/', (req, res) => {
    const ordersQuery = `
        SELECT 
            o.order_id,
            o.user_id, 
            o.total_price, 
            o.status, 
            o.created_at,
            u.username
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        ORDER BY o.created_at ASC
    `;

    db.query(ordersQuery, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        const itemsQuery = `
            SELECT 
                oi.order_id, 
                oi.book_id, 
                oi.quantity, 
                oi.unit_price, 
                b.title
            FROM order_items oi
            JOIN books b ON oi.book_id = b.book_id
        `;

        db.query(itemsQuery, (err, items) => {
            if (err) {
                console.error('Error fetching order items:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            // Combine orders with their items
            const ordersWithItems = orders.map(order => {
                const orderItems = items.filter(i => i.order_id === order.order_id);
                return {
                    ...order,
                    items: orderItems
                };
            });

            res.json(ordersWithItems);
        });
    });
});

// API call to create a new order with the order items
router.post('/create', (req, res) => {
    const { user_id, total_price, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: 'Transaction start failed' });

        const insertOrderSql = `
        INSERT INTO 
            orders (user_id, total_price) 
        VALUES (?, ?)
        `;
        db.query(insertOrderSql, [user_id, total_price], (err, orderResult) => {
            if (err) return db.rollback(() => res.status(500).json({ message: 'Failed to create order' }));

            const orderId = orderResult.insertId;
            const itemValues = items.map(i => [
                orderId,
                i.book_id,
                i.quantity,
                i.price || 0
            ]);

            const insertItemsSql = `
            INSERT INTO 
                order_items (order_id, book_id, quantity, unit_price) 
            VALUES ?
            `;
            db.query(insertItemsSql, [itemValues], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ message: 'Failed to add items' }));
                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ message: 'Commit failed' }));
                    return res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
                });
            });
        });
    });
});

// API call to get the orders information for one user based on their id
router.get('/user/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `
      SELECT 
        o.order_id,
        o.total_price,
        o.status,
        o.created_at,
        oi.book_id,
        b.title,
        oi.quantity,
        oi.unit_price
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN books b ON oi.book_id = b.book_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch orders' });

        // Group items under their order
        const orders = {};
        for (const row of results) {
            const {
                order_id,
                total_price,
                status,
                created_at,
                book_id,
                title,
                quantity,
                unit_price
            } = row;

            if (!orders[order_id]) {
                orders[order_id] = {
                    order_id,
                    total_price,
                    status,
                    created_at,
                    items: []
                };
            }

            orders[order_id].items.push({ book_id, title, quantity, unit_price });
        }

        res.json(Object.values(orders));
    });
});

// API call to cancel a particular order based on the id
router.patch('/cancel/:orderId', (req, res) => {
    const { orderId } = req.params;
    const userId = req.session.user?.id || req.body.user_id;

    db.query(
        'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
        [orderId, userId],
        (err, results) => {
            if (err) {
                console.error('DB error:', err);
                return res.status(500).json({ message: 'Server error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            const order = results[0];
            if (order.status !== 'pending') {
                return res.status(400).json({ message: 'Only pending orders can be cancelled.' });
            }

            db.query(
                'UPDATE orders SET status = ? WHERE order_id = ?',
                ['cancelled', orderId],
                (err2) => {
                    if (err2) {
                        console.error('Update error:', err2);
                        return res.status(500).json({ message: 'Server error.' });
                    }

                    res.status(200).json({ message: 'Order cancelled.' });
                }
            );
        }
    );
});

// API call to modify the status of an order based on the id
router.patch('/status/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';

    db.query(query, [status, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json({ message: 'Order status updated.' });
    });
});

export default router;