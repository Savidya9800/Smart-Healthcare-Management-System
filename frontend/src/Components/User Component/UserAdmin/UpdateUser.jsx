import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";

function UpdateUser({ user, onClose }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    bloodGroup: user.bloodGroup,
    country: user.country,
    city: user.city,
    gender: user.gender,
    dateOfBirth: new Date(user.dateOfBirth).toISOString().split("T")[0], // Formatted for date picker
  });

  // Colors
  const colors = {
    darkGray: "#71717d",
    gray: "#828487",
    pink: "#e6317d",
    white: "#ffffff",
    blue: "#2b2c6c",
    green: "#2fb297",
  };

  // Gender options
  const genderOptions = ["Male", "Female", "Other"].map((g) => ({
    value: g,
    label: g,
  }));

  // Blood group options
  const bloodGroupOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ].map((group) => ({
    value: group,
    label: group,
  }));

  // Country and City options
  const countryOptions = {
    SriLanka: ["Colombo", "Kandy", "Galle", "Jaffna", "Kurunegala"],
    USA: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    UK: ["London", "Manchester", "Birmingham", "Liverpool"],
    India: ["Delhi", "Mumbai", "Bangalore", "Chennai"],
  };

  const countryList = Object.keys(countryOptions).map((country) => ({
    value: country,
    label: country,
  }));

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData({
        ...formData,
        country: value,
        city: countryOptions[value]?.[0] || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle update submission
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData
      );

      if (response.status === 200) {
        alert("Patient details updated successfully!");
        window.location.reload();

        if (onUpdate) {
          onUpdate(response.data); // Call onUpdate to refresh UI
        }

        onClose(); // Close modal
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Custom styles for inputs
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: colors.green,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.green,
    },
    "& .MuiInputAdornment-root": {
      color: colors.darkGray,
    },
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: colors.white,
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          border: `2px solid ${colors.green}`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ color: colors.blue, fontWeight: 600 }}>
            UPDATE PATIENT DETAILS
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.pink,
              "&:hover": { bgcolor: `${colors.pink}20` },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Date of Birth (Moved Up) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Blood Group */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              sx={inputStyle}
            >
              {bloodGroupOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              sx={inputStyle}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              sx={inputStyle}
            >
              {countryList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              sx={inputStyle}
            >
              {countryOptions[formData.country]?.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{ bgcolor: colors.green }}
          >
            Update Patient
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default UpdateUser;
