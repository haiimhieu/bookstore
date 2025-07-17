import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Button,
    Menu,
    MenuItem,
    InputBase,
    Badge,
    Divider
} from '@mui/material';

import { styled, alpha } from '@mui/material/styles';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '60ch',
        },
    },
}));

function Navbar() {
    const { user, setUser, isAdmin, setIsAdmin } = useAuth()
    const [anchorEl, setAnchorEl] = useState(null);
    const [genreList, setGenreList] = useState([]);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { basket, clearBasket } = useBasket();
    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        axios.get(`http://localhost:3000/api/genre/getAllGenre`)
            .then(res => setGenreList(res.data))
            .catch(err => console.error(err))
    }, []);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#0e6428ff' }}  >
            <Container maxWidth="xl">
                <Toolbar disableGutters >
                    <AutoStoriesRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        HIEU'S BOOK STORE
                    </Typography>



                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Button
                            onClick={handleClick}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            GENRES
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {genreList.map(genre => (
                                <MenuItem key={genre.name} component={Link} to={`/genre/${genre.genre_id}`} onClick={handleClose}>
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Menu>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchTerm.trim() !== '') {
                                        navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
                                        setSearchTerm('');
                                    }

                                }}
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        {user ? (<Link to="/myorders">
                            <Button sx={{ color: 'white', ml: 2 }}>My Orders</Button>
                        </Link>) : null}
                        {isAdmin == 1 ? (<Link to="/allorders">
                            <Button sx={{ color: 'white', ml: 2 }}>Fullfill Orders</Button>
                        </Link>) : null}

                    </Box>

                    {!user ? (
                        <Button
                            component={Link}
                            to="/login"
                            sx={{ my: 2, color: 'white' }}
                        >
                            Login/Sign Up
                        </Button>
                    ) : (
                        <>
                            <Button
                                sx={{ my: 2, color: 'white' }}
                                onClick={async () => {
                                    try {
                                        await axios.post('http://localhost:3000/api/user/logout', {}, { withCredentials: true });
                                        setUser(null);
                                        clearBasket();
                                        setIsAdmin(0);
                                        navigate('/home')
                                    } catch (err) {
                                        console.error('Logout failed:', err);
                                    }
                                }}
                            >
                                Logout
                            </Button>
                            <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: "white" }} />
                            <Link to="/order">
                                <Badge badgeContent={totalItems} color="secondary">
                                    <ShoppingCartIcon sx={{ color: 'white', ml: 2 }} />
                                </Badge>
                            </Link>
                        </>
                    )}

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;