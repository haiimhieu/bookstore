import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
    const { setUser, setIsAdmin } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:3000/api/user/login', {
                username,
                password
            }, {
                withCredentials: true
            });

            if (res.data.loggedIn) {
                setUser(res.data.user);
                setIsAdmin(res.data.user.isAdmin);
                navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h5" gutterBottom>Log in to your account </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#0e6428ff'}}
                    >
                        Log In
                    </Button>
                </form>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center'}}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
                        Sign up here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default LoginPage;