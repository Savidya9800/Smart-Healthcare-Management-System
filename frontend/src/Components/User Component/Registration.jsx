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
  Grid,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined,
  PersonOutlined 
} from '@mui/icons-material';

function Registration() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Name validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    // Email validation
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    
    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one letter, one number, and one special character');
      return false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Logo Section */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-[200px] w-auto" 
            />
          </Grid>

          {/* Registration Form Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={6} 
              sx={{ 
                padding: 4,
                borderRadius: 3,
                maxWidth: 400,
                margin: '0 auto'
              }}
            >
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  marginBottom: 3,
                  textAlign: 'center',
                  color: '#1976d2'
                }}
              >
                Create Account
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

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>

                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Button 
                    color="primary" 
                    onClick={() => navigate('/login')}
                    sx={{ textTransform: 'none' }}
                  >
                    Already have an account? Sign In
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Registration;
