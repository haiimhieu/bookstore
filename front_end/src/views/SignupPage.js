import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom'
import axios from 'axios';

function SignUpPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { username, email, password, confirmPassword } = form;

        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/user/register', {
                username,
                email,
                password
            });

            if (res.status === 201) {
                setSuccess('Account created successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
                <Typography variant="h5" gutterBottom>Sign Up</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth label="Username" name="username" margin="normal"
                        value={form.username} onChange={handleChange} required
                    />
                    <TextField
                        fullWidth label="Email" name="email" type="email" margin="normal"
                        value={form.email} onChange={handleChange} required
                    />
                    <TextField
                        fullWidth label="Password" name="password" type="password" margin="normal"
                        value={form.password} onChange={handleChange} required
                    />
                    <TextField
                        fullWidth label="Confirm Password" name="confirmPassword" type="password" margin="normal"
                        value={form.confirmPassword} onChange={handleChange} required
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#0e6428ff'}}>
                        Register
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
                            Log in here
                        </Link>
                    </Typography>

                </form>
            </Box>
        </Container>
    );
}

export default SignUpPage;