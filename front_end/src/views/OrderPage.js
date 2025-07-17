import React from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Button,
    Divider
} from '@mui/material';
import { useBasket } from '../context/BasketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton } from '@mui/material';

function OrderPage() {
    const { basket, updateQuantity, clearBasket, removeFromBasket } = useBasket();
    const { user } = useAuth();
    const navigate = useNavigate();

    const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const handleSubmitOrder = async () => {
        if (!user) return alert('You must be logged in to place an order.');

        try {
            const res = await axios.post('http://localhost:3000/api/orders/create', {
                user_id: user.id,
                total_price: totalPrice,
                items: basket.map(item => ({
                    book_id: item.book_id,
                    quantity: item.quantity,
                    price: item.price,
                }))
            }, { withCredentials: true });

            if (res.status === 201) {
                clearBasket();
                alert('✅ Order placed successfully!');
                navigate('/');
            } else {
                alert('❌ Failed to place order.');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('❌ Something went wrong.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                align="left"
                sx={{ color: '#808080', paddingBottom: "20px" }}
            >
                Review Your Order
            </Typography>
            {basket.length === 0 ? (
                <Typography variant="h6" sx={{ paddingTop: "20px" }}>Your basket is empty.</Typography>
            ) : (
                <>
                    {basket.map((item) => (
                        <Card key={item.book_id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* Left side - Book info */}
                                    <Box>
                                        <Typography variant="h6">{item.title}</Typography>
                                        <Typography>Author: {item.author}</Typography>
                                    </Box>

                                    {/* Right side - Quantity, Subtotal, Delete */}
                                    <Box sx={{ textAlign: 'right' }}>
                                        <TextField
                                            type="number"
                                            label="Quantity"
                                            size="small"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(item.book_id, parseInt(e.target.value) || 1)
                                            }
                                            sx={{ width: 100, mb: 1 }}
                                        />
                                        <Typography>
                                            Subtotal: ${(item.quantity * item.price).toFixed(2)}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => removeFromBasket(item.book_id)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Total: ${totalPrice}</Typography>
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitOrder}
                            style={{ padding: '8px 16px', backgroundColor: '#0e6428', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Confirm and Place Order
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
}

export default OrderPage;