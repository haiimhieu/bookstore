import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from "../components/BookCard";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function SearchPage() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 26; // items per page
    const { query } = useParams();
    const [sortBy, setSortBy] = useState(1);
    let pageCount = 1;
    const sortOptions = [
        { label: 'Most Relevance', value: 1 },
        { label: 'Title', value: 2 },
        { label: 'Author', value: 3 },
    ];
    useEffect(() => {
        setSortBy(1);
    }, [query]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/books/search?searchQuery=${query}&limit=${limit}&sortBy=${sortBy}`)
            .then(res => setBooks(res.data))
            .catch(err => console.error(err));
        if (books.size > 25) {
            pageCount += 1
        }
    }, [page, query, sortBy]);

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
                {books.length > 0 ?
                    <Typography
                        variant="h4"
                        align="left"
                        sx={{ color: '#808080' }}
                    >
                        Showing Results for {' '}
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                            {query}
                        </Box>
                    </Typography> :
                    <Typography
                        variant="h4"
                        align="left"
                        sx={{ color: '#808080' }}
                    >
                        Sorry, we couldn't find anything for {' '}
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                            {query}
                        </Box>
                    </Typography>}
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
                <Pagination count={pageCount} page={page} onChange={handleChange} size="large" />
            </Stack>
        </div>
    );
}

export default SearchPage;