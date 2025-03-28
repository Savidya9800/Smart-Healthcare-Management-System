import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress, MenuItem } from "@mui/material";

function DoctorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experience: "",
    address: "",
    availability: "",
    gender: "",
    dateOfBirth: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register-doctor", formData);
      alert("Doctor registration successful! Please login.");
      navigate("/login-doctor"); // Redirect to doctor login page
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Doctor Registration
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
        <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Qualifications (comma-separated)" name="qualifications" value={formData.qualifications} onChange={handleChange} margin="normal" required />
        <TextField fullWidth type="number" label="Experience (years)" name="experience" value={formData.experience} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Availability" name="availability" value={formData.availability} onChange={handleChange} margin="normal" required />
        <TextField fullWidth type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange} margin="normal" required>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </form>
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Already have an account? <Button onClick={() => navigate("/login-doctor")}>Sign In</Button>
      </Typography>
    </Box>
  );
}

export default DoctorRegistration;
