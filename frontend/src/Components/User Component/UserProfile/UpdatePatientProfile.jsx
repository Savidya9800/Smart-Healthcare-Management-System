import React, { useState, useEffect } from "react";
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
  Divider,
  Paper,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import WcIcon from "@mui/icons-material/Wc";
import OpacityIcon from "@mui/icons-material/Opacity";
import SaveIcon from "@mui/icons-material/Save";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

function UpdatePatientProfile({ user, onClose, onUpdate }) {
  // Country and City options
  const countryOptions = {
    SriLanka: ["Colombo", "Kandy", "Galle", "Jaffna", "Kurunegala"],
    USA: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    UK: ["London", "Manchester", "Birmingham", "Liverpool"],
    India: ["Delhi", "Mumbai", "Bangalore", "Chennai"],
  };

  const [formData, setFormData] = useState({
    ...user,
    dateOfBirth: user.dateOfBirth && !isNaN(new Date(user.dateOfBirth).getTime()) 
      ? new Date(user.dateOfBirth).toISOString().split("T")[0] 
      : "", // Safely format date for input or use empty string
    country: user.country || Object.keys(countryOptions)[0],
    city: user.city || "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [availableCities, setAvailableCities] = useState([]);

  // Update available cities when country changes
  useEffect(() => {
    if (formData.country && countryOptions[formData.country]) {
      setAvailableCities(countryOptions[formData.country]);

      // If current city is not in the list of available cities, reset it
      if (!countryOptions[formData.country].includes(formData.city)) {
        setFormData((prev) => ({
          ...prev,
          city: "",
        }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    const nameRegex = /^[A-Za-z\s\-]+$/; // Allow spaces and hyphens

    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|outlook\.com)$/;
    const today = new Date().toISOString().split("T")[0];

    switch (name) {
      case "name":
        if (value && !nameRegex.test(value)) {
          newErrors.name = "Only letters and spaces allowed.";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (value && !emailRegex.test(value)) {
          newErrors.email = "Invalid email format.";
        } else {
          delete newErrors.email;
        }
        break;

      case "mobile":
        if (value && !/^07[0-9]{8}$/.test(value)) {
          newErrors.mobile =
            "Mobile number must start with 07 and have 10 digits.";
        } else {
          delete newErrors.mobile;
        }
        break;

      case "dateOfBirth":
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          
          if (birthDate > today) {
            newErrors.dateOfBirth = "Date of birth cannot be in the future";
          } else {
            delete newErrors.dateOfBirth;
          }
        } else {
          delete newErrors.dateOfBirth; // Optional field
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "name"
        ? value.replace(/\\b\\w/g, (char) => char.toUpperCase())
        : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    validateField(name, formattedValue);
  };

  const handleNext = () => {
    const keysToValidate = ["name", "email", "mobile", "dateOfBirth"];
    keysToValidate.forEach((k) => validateField(k, formData[k]));
    if (Object.keys(errors).length === 0) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleUpdate = async () => {
    const allKeys = Object.keys(formData);
    allKeys.forEach((k) => validateField(k, formData[k]));
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
      setTimeout(() => onUpdate(res.data), 1000);
    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Input styles...
  const inputStyles = {
    /* same */
  };
  const bloodGroupStyles = {
    /* same */
  };
  const genderOptions = ["Male", "Female", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Modal
        open={true}
        onClose={loading ? null : onClose}
        closeAfterTransition
      >
        <Fade in={true}>
          <Paper
            elevation={5}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 600 },
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "white",
              boxShadow: 24,
              p: 0,
              borderRadius: 3,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#2fb297",
                py: 2,
                px: 3,
                borderRadius: "12px 12px 0 0",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "500" }}>
                Update Profile
              </Typography>
              <IconButton
                onClick={onClose}
                disabled={loading}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="#71717d" sx={{ mb: 3 }}>
                Update your personal information below. Fields marked with * are
                required.
              </Typography>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      fontWeight="medium"
                      color="#2b2c6c"
                      gutterBottom
                    >
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      placeholder="Enter your full name (e.g., John Smith)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="Enter your email (e.g., name@gmail.com)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="mobile"
                      label="Mobile Number"
                      value={formData.mobile}
                      onChange={handleChange}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      placeholder="07XXXXXXXX"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "07[0-9]{8}",
                        maxLength: 10,
                      }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        max: today,
                        placeholder: "YYYY-MM-DD"
                      }}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  </Grid>

                  {/* Next Button */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={<NavigateNextIcon />}
                        sx={{
                          bgcolor: "#e6317d",
                          "&:hover": {
                            bgcolor: "#c62a6a",
                          },
                          minWidth: "140px",
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* Step 2: Location and Medical Information */}
              {step === 2 && (
                <Grid container spacing={3}>
                  {/* Location Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      fontWeight="medium"
                      color="#2b2c6c"
                      gutterBottom
                    >
                      Location
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  {/* Country Dropdown */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Country"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleChange}
                      placeholder="Select your country"
                      displayEmpty
                      SelectProps={{
                        renderValue: (selected) => {
                          if (!selected) {
                            return <em style={{color: "#757575"}}>Select your country</em>;
                          }
                          return selected;
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlagIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    >
                      <MenuItem disabled value="">
                        <em>Select your country</em>
                      </MenuItem>
                      {Object.keys(countryOptions).map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* City Dropdown */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="City"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      displayEmpty
                      SelectProps={{
                        renderValue: (selected) => {
                          if (!selected) {
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <em style={{color: "#757575"}}>Select your city</em>
                              </Box>
                            );
                          }
                          return selected;
                        },
                      }}
                      disabled={!formData.country || availableCities.length === 0}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    >
                      <MenuItem disabled value="">
                        <em>Select your city</em>
                      </MenuItem>
                      {availableCities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Medical Information Section */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="medium"
                      color="#2b2c6c"
                      gutterBottom
                    >
                      Medical Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  {/* Gender Dropdown */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      displayEmpty
                      SelectProps={{
                        renderValue: (selected) => {
                          if (!selected) {
                            return <em style={{color: "#757575"}}>Select your gender</em>;
                          }
                          return selected;
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WcIcon sx={{ color: "#2b2c6c" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    >
                      <MenuItem disabled value="">
                        <em>Select your gender</em>
                      </MenuItem>
                      {genderOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Blood Group Dropdown */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Blood Group"
                      name="bloodGroup"
                      value={formData.bloodGroup || ""}
                      onChange={handleChange}
                      displayEmpty
                      SelectProps={{
                        renderValue: (selected) => {
                          if (!selected) {
                            return <em style={{color: "#757575"}}>Select your blood group</em>;
                          }
                          return selected;
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <OpacityIcon sx={{ color: "#e6317d" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={bloodGroupStyles}
                    >
                      <MenuItem disabled value="">
                        <em>Select your blood group</em>
                      </MenuItem>
                      {bloodGroupOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        startIcon={<NavigateBeforeIcon />}
                        sx={{
                          borderColor: "#2b2c6c",
                          color: "#2b2c6c",
                          "&:hover": {
                            borderColor: "#2b2c6c",
                            backgroundColor: "rgba(43, 44, 108, 0.04)",
                          },
                        }}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Box>
                        <Button
                          onClick={onClose}
                          variant="outlined"
                          sx={{
                            mr: 2,
                            borderColor: "#71717d",
                            color: "#71717d",
                            "&:hover": {
                              borderColor: "#2b2c6c",
                              backgroundColor: "rgba(43, 44, 108, 0.04)",
                            },
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdate}
                          variant="contained"
                          disabled={loading}
                          startIcon={
                            loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <SaveIcon />
                            )
                          }
                          sx={{
                            bgcolor: "#e6317d",
                            "&:hover": {
                              bgcolor: "#c62a6a",
                            },
                            minWidth: "140px",
                          }}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
export default UpdatePatientProfile;
