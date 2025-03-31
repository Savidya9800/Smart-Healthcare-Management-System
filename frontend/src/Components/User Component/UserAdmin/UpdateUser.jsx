// ✅ Updated version of your UpdateUser component with real-time validation (with red border live like shown in image)

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
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    bloodGroup: user.bloodGroup,
    country: user.country,
    city: user.city,
    gender: user.gender,
    dateOfBirth: new Date(user.dateOfBirth).toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^07[0-9]{8}$/;

    switch (name) {
      case "name":
        if (value && !nameRegex.test(value))
          newErrors.name = "Only letters and spaces allowed.";
        else delete newErrors.name;
        break;
      case "email":
        if (value && !emailRegex.test(value))
          newErrors.email = "Invalid email format.";
        else delete newErrors.email;
        break;
      case "mobile":
        if (value && !mobileRegex.test(value))
          newErrors.mobile = "Mobile must start with 07 and be 10 digits.";
        else delete newErrors.mobile;
        break;
      case "dateOfBirth":
        if (!value) newErrors.dateOfBirth = "Required";
        else if (value >= today) newErrors.dateOfBirth = "Must be a past date.";
        else delete newErrors.dateOfBirth;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "name")
      formattedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());

    if (name === "country") {
      setFormData({
        ...formData,
        country: formattedValue,
        city: countryOptions[formattedValue]?.[0] || "",
      });
    } else {
      setFormData({ ...formData, [name]: formattedValue });
    }

    validateField(name, formattedValue);
  };

  const isFormValid = () => {
    const validationFields = ["name", "email", "mobile", "dateOfBirth"];
    validationFields.forEach((key) => validateField(key, formData[key]));
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!isFormValid()) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData
      );
      if (response.status === 200) {
        alert("Patient details updated successfully!");
        window.location.reload();
        if (onUpdate) onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const colors = {
    darkGray: "#71717d",
    gray: "#828487",
    pink: "#e6317d",
    white: "#ffffff",
    blue: "#2b2c6c",
    green: "#2fb297",
  };

  const genderOptions = ["Male", "Female", "Other"].map((g) => ({
    value: g,
    label: g,
  }));
  const bloodGroupOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ].map((group) => ({ value: group, label: group }));

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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              helperText={errors.mobile}
              inputProps={{
                inputMode: "numeric",
                pattern: "07[0-9]{8}",
                maxLength: 10,
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
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
