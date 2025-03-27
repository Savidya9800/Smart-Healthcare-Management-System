import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Password reset link sent to your email. Please check your inbox.');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to send password reset link. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper 
        elevation={6} 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 4,
          borderRadius: 3
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            marginBottom: 3,
            background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Forgot Password
        </Typography>

        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            textAlign: 'center', 
            marginBottom: 2 
          }}
        >
          Enter your email and we'll send you a link to reset your password
        </Typography>

        {error && (
          <Typography 
            color="error" 
            sx={{ 
              width: '100%', 
              textAlign: 'center', 
              marginBottom: 2 
            }}
          >
            {error}
          </Typography>
        )}

        {message && (
          <Typography 
            color="primary" 
            sx={{ 
              width: '100%', 
              textAlign: 'center', 
              marginBottom: 2 
            }}
          >
            {message}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #2196f3)'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>

          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Back to Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;