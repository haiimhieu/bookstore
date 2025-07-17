import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import BookCard from '../components/BookCard';

import {
    Box,
    Typography,
    Pagination,
    Stack,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';

function GenrePage() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [genreString, setGenreString] = useState('');
    const limit = 26; // items per page
    const { genreId } = useParams();
    const genre_id = parseInt(genreId, 10);
    const [sortBy, setSortBy] = useState(1);
    const sortOptions = [
        { label: 'A to Z', value: 1 },
        { label: 'Z to A', value: 2 },
        { label: 'Price: Low to High', value: 3 },
        { label: 'Price: High to Low', value: 4 },
        { label: 'Highest Rating', value: 5 },
        { label: 'Lowest Rating', value: 6 }
    ];
    useEffect(() => {
        setSortBy(1);
    }, [genre_id]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/genre?genreId=${genre_id}&page=${page}&limit=${limit}&sortBy=${sortBy}`)
            .then(res => setBooks(res.data))
            .catch(err => console.error(err));
        axios.get(`http://localhost:3000/api/genre/getGenre?genreId=${genreId}`)
            .then(res => setGenreString(res.data))
            .catch(err => console.error(err));
    }, [page, genre_id, sortBy]);

    const handleChange = (event, value) => {
        setPage(value);
    };
    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingX: '10%',
                    mt: 4,
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    align="left"
                    sx={{ color: '#808080' }}
                >
                    Showing Results for {' '}
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                        {genreString}
                    </Box>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ color: '#808080' }}>
                        Sort by:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {books.map(book => (
                    <BookCard
                        key={book.book_id}
                        id={book.book_id}
                        title={book.title}
                        genre={book.genre || "Unknown"}
                        author={book.author}
                        price={book.price}
                        rating={book.avg_rating}
                        image_url={book.image_url}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <Stack alignItems={'center'} spacing={2} sx={{ marginBottom: '20px' }}>
                <Pagination count={20} page={page} onChange={handleChange} size="large" />
            </Stack>
        </div>
    );
}

export default GenrePage;