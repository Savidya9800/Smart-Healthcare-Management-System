import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "✅ Login Successful",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "#f0f4ff",
        color: "#2b2c6c",
        iconColor: "#2fb297",
        customClass: {
          popup: "swal2-rounded",
        },
      });

      setTimeout(() => {
        const adminEmails = [
          "useradmin@gmail.com",
          "pharmacyadmin@gmail.com",
          "doctoradmin@gmail.com",
          "appointmentadmin@gmail.com",
        ];

        if (adminEmails.includes(formData.email)) {
          if (formData.email === "useradmin@gmail.com") {
            navigate("/User-Dashboard");
          } else if (formData.email === "pharmacyadmin@gmail.com") {
            navigate("/Pharmacy-Dashboard");
          } else if (formData.email === "doctoradmin@gmail.com") {
            navigate("/Doctor-Dashboard");
          } else if (formData.email === "appointmentadmin@gmail.com") {
            navigate("/Appointment-Dashboard");
          }
        } else {
          navigate("/Home");
        }
      }, 2500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Logo Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src="/Logo.png" alt="Logo" className="h-[200px] w-auto" />
          </Grid>

          {/* Login Form Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                borderRadius: 3,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  marginBottom: 1,
                  textAlign: "center",
                  color: "#1976d2",
                }}
              >
                Welcome
              </Typography>
              <Typography
                component="h2"
                variant="h5"
                sx={{
                  fontWeight: 500,
                  marginBottom: 3,
                  textAlign: "center",
                  color: "#1976d2",
                }}
              >
                MEDI FLOW
              </Typography>

              {error && (
                <Typography
                  color="error"
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: 2,
                  }}
                >
                  {error}
                </Typography>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
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
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                    ),
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
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Button
                    color="primary"
                    onClick={() => navigate("/forgot-password")}
                    sx={{ textTransform: "none" }}
                  >
                    Forgot Password?
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate("/Registration")}
                    sx={{ textTransform: "none" }}
                  >
                    Create Account
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

export default Login;
