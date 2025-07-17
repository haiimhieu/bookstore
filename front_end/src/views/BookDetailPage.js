import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    Rating,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';
import { useNavigate, Link } from 'react-router-dom';

function BookDetailPage() {
    const { user } = useAuth()
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [newContent, setNewContent] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const { addToBasket } = useBasket();
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        try {
            await axios.post('http://localhost:3000/api/reviews/addOrUpdate', {
                user_id: user.id,
                book_id: bookId,
                rating: newRating,
                content: newContent
            }, { withCredentials: true });

            setSubmitSuccess('Review saved.');
            setNewContent('');
            setNewRating(0);

            const updated = await axios.get(`http://localhost:3000/api/reviews/book/${bookId}`);
            setReviews(updated.data);
        } catch (err) {
            setSubmitError('Error submitting review.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:3000/api/reviews/delete', {
                data: { user_id: user.id, book_id: bookId },
                withCredentials: true
            });

            setNewContent('');
            setNewRating(0);
            setSubmitSuccess('Review deleted.');

            const updated = await axios.get(`http://localhost:3000/api/reviews/book/${bookId}`);
            setReviews(updated.data);
        } catch (err) {
            setSubmitError('Error deleting review.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookRes, reviewRes, avgRating] = await Promise.all([
                    axios.get(`http://localhost:3000/api/books/${bookId}`),
                    axios.get(`http://localhost:3000/api/reviews/book/${bookId}`),
                    axios.get(`http://localhost:3000/api/reviews/book/getAverage/${bookId}`)
                ]);
                setBook(bookRes.data);
                setReviews(reviewRes.data);
                setAverageRating(avgRating.data);
            } catch (err) {
                console.error('Error fetching book or reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookId]);

    const userReview = reviews.find((r) => r.username === user?.username);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box mt={5} textAlign="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!book) {
        return (
            <Container maxWidth="md">
                <Box mt={5} textAlign="center">
                    <Typography variant="h5">Book not found</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <Box sx={{ flexShrink: 0 }}>
                    <img
                        src={book.image_url}
                        alt={book.title}
                        style={{ width: '180px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
                    />
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom><strong>{book.title}</strong></Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Author: <Link
                            to={`/search/${encodeURIComponent(book.author)}`}
                            onClick={e => e.stopPropagation()}
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                            <strong>{book.author}</strong>
                        </Link>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Genre: <Link
                            to={`/genre/${book.genre_id}`}
                            onClick={e => e.stopPropagation()}
                            style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                            <strong>{book.genre}</strong>
                        </Link>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Price: <strong>${book.price}</strong>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        In Stock: <strong>{book.stock_quantity}</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Average Rating:
                        </Typography>
                        <Rating
                            value={averageRating}
                            precision={0.1}
                            readOnly
                            emptyIcon={<StarIcon style={{ opacity: 0 }} />}
                            sx={{ position: 'relative', top: '-5px' }}
                        />
                    </Box>
                    {user ? (
                        <Button
                            onClick={() => {
                                addToBasket(book);
                                setOpenDialog(true);
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0e6428',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                marginTop: '10px'
                            }}
                        >
                            Add to Order
                        </Button>
                    ) : (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                                Please <Link
                                    to={`/login`}
                                    onClick={e => e.stopPropagation()}
                                    style={{ textDecoration: 'none', color: '#1976d2' }}
                                >
                                    <strong>sign in</strong>
                                </Link> to add to order.
                        </Typography>
                    )}

                </Box>
            </Box>
            <Divider />
            <Typography variant="h5" gutterBottom sx={{ paddingTop: "20px" }}>
                Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography>No reviews yet.</Typography>
            ) : (
                reviews.map((review, index) => (
                    <Card key={index} sx={{ my: 2 }}>
                        <CardContent>
                            <Rating value={review.rating} readOnly />
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {review.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                — User {review.username} | {new Date(review.created_at).toLocaleDateString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
            {user && (
                <Box sx={{ my: 3 }}>
                    <Typography variant="h6">
                        {userReview ? 'Edit Your Review' : 'Add a Review'}
                    </Typography>
                    <Box component="form" onSubmit={handleReviewSubmit}>
                        <Rating
                            value={newRating}
                            onChange={(e, val) => setNewRating(val)}
                            sx={{ my: 1 }}
                        />
                        <Box component="textarea"
                            rows={4}
                            style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
                            placeholder="Write your review..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                        {submitError && <Typography color="error">{submitError}</Typography>}
                        {submitSuccess && <Typography color="green">{submitSuccess}</Typography>}
                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                            <Button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0e6428', color: 'white', border: 'none', borderRadius: '4px' }}>
                                {userReview ? 'Update Review' : 'Submit Review'}
                            </Button>
                            {userReview && (
                                <Button
                                    type="button"
                                    onClick={handleDelete}
                                    style={{ padding: '8px 16px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    Delete Review
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Added to Order</DialogTitle>
                <DialogContent>
                    <Typography>Would you like to continue shopping or view your order?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDialog(false);
                    }}>Continue Shopping</Button>
                    <Button onClick={() => {
                        setOpenDialog(false);
                        navigate('/order');
                    }} style={{ backgroundColor: '#0e6428' }} variant="contained">
                        Go to Order
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BookDetailPage;