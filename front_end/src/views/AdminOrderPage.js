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
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function AdminOrderPage() {
    const { user, isAdmin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/orders', { withCredentials: true });
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await axios.patch(
                `http://localhost:3000/api/orders/status/${selectedOrderId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            setConfirmOpen(false);
            fetchOrders();
        } catch (err) {
            console.error('Status update failed:', err);
            alert('❌ Could not update order status.');
        }
    };

    useEffect(() => {
        if (isAdmin != 1) return;
        fetchOrders();
    }, [user]);

    if (isAdmin != 1) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5">Access Denied</Typography>
                <Typography>You do not have permission to view this page.</Typography>
            </Container>
        );
    }

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
                <DialogTitle>Change Order Status</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to change the status of this order to "{newStatus}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">No</Button>
                    <Button onClick={handleStatusUpdate} color="success">Yes, Confirm</Button>
                </DialogActions>
            </Dialog>

            <Typography
                variant="h4"
                align="left"
                sx={{ color: '#808080', paddingBottom: '20px' }}
            >
                Manage All Orders
            </Typography>
            {orders.length === 0 ? (
                <Typography>No orders found.</Typography>
            ) : (
                orders.map(order => (
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
                            <Typography>User: {order.username}</Typography>
                            <Typography>Total: ${order.total_price}</Typography>

                            <Box sx={{ mt: 1 }}>
                                <FormControl size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={order.status}
                                        label="Status"
                                        onChange={(e) => {
                                            setSelectedOrderId(order.order_id);
                                            setNewStatus(e.target.value);
                                            setConfirmOpen(true);
                                        }}
                                        sx={{ width: 150 }}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

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
                ))
            )}
        </Container>
    );
}

export default AdminOrderPage;