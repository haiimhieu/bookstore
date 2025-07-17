import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserOrderPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            const res = await axios.get(`http://localhost:3000/api/orders/user/${user.id}`, {
                withCredentials: true
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        axios.get(`http://localhost:3000/api/orders/user/${user.id}`, { withCredentials: true })
            .then(res => setOrders(res.data))
            .catch(err => console.error('Error fetching orders', err))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box mt={5} textAlign="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this order?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                await axios.patch(
                                    `http://localhost:3000/api/orders/cancel/${selectedOrderId}`,
                                    { user_id: user.id },
                                    { withCredentials: true }
                                );
                                alert('✅ Order cancelled.');
                                setConfirmOpen(false);
                                fetchOrders(); // reload order list
                            } catch (err) {
                                console.error(err);
                                alert('❌ Failed to cancel order.');
                            }
                        }}
                        color="error"
                    >
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h4"
                align="left"
                sx={{ color: '#808080' }} gutterBottom>My Orders</Typography>
            {orders.length === 0 ? (
                <Typography>You haven't placed any orders yet.</Typography>
            ) : (
                orders.map(order => 
                    <Card key={order.order_id} sx={{
                        mb: 3, 
                        backgroundColor: order.status === 'completed'
                            ? '#90ee90'
                            : order.status === 'cancelled'
                                ? '#FFADB0'
                                : 'inherit',
                    }}>
                        <CardContent>
                            <Typography variant="h6">
                                <strong>Order #{order.order_id}</strong>
                            </Typography>
                            <Typography color="text.secondary">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                Status:{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        color:
                                            order.status === 'completed'
                                                ? 'green'
                                                : order.status === 'cancelled'
                                                    ? 'red'
                                                    : 'inherit',
                                        fontWeight: "Bold"
                                    }}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Box>
                            </Typography>
                            <Typography>Total: ${order.total_price}</Typography>
                            {order.status === 'pending' && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setSelectedOrderId(order.order_id);
                                        setConfirmOpen(true);
                                    }}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Divider sx={{ my: 1 }} />
                            {order.items.map(item => (
                                <Box key={item.book_id} sx={{ ml: 2, mb: 1 }}>
                                    <Typography variant="body1">
                                        {item.title} × {item.quantity} — ${item.unit_price} each
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                )
            )}
        </Container>
    );
}

export default UserOrderPage;