import React from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Rating,
    CardMedia
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// Book card component that is used to display all the book details on pages 
function BookCard({ id, title, genre, author, price, rating, image_url }) {
    return (
        <Card
            component={Link}
            to={`/book/${id}`}
            sx={{
                width: '40%',
                m: 2,
                boxShadow: 3,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                    backgroundColor: '#f9f9f9',
                },
            }}
        >
            <Box sx={{ display: 'flex' }}>
                <CardMedia
                    component="img"
                    image={image_url}
                    alt={title}
                    sx={{
                        width: 120,
                        height: 180,
                        objectFit: 'cover',
                        borderRadius: '4px 0 0 4px',
                    }}
                />
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Genre: <strong>{genre}</strong>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Author:{' '}
                        <strong>
                            <Link
                                to={`/search/${encodeURIComponent(author)}`}
                                onClick={e => e.stopPropagation()}
                                style={{ textDecoration: 'none', color: '#1976d2' }}
                            >
                                {author}
                            </Link>
                        </strong>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Average Rating:
                        </Typography>
                        <Rating
                            value={rating}
                            precision={0.1}
                            readOnly
                            emptyIcon={<StarIcon style={{ opacity: 0.2 }} />}
                            sx={{ position: 'relative', top: '-1px' }}
                        />
                    </Box>

                    <Box mt={2}>
                        <Typography variant="subtitle1" color="primary">
                            ${price}
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
}

export default BookCard;
