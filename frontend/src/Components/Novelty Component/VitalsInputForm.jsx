import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  FormHelperText,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TimerIcon from "@mui/icons-material/Timer";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import InfoIcon from "@mui/icons-material/Info";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function VitalsInputForm() {
  const [bp, setBp] = useState(120);
  const [pulse, setPulse] = useState(75);
  const [sugar, setSugar] = useState(100);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to save your vitals");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    if (bp < 70 || bp > 200) {
      errors.bp = "Blood pressure should be between 70-200 mmHg";
    }

    if (pulse < 40 || pulse > 200) {
      errors.pulse = "Pulse rate should be between 40-200 bpm";
    }

    if (sugar < 50 || sugar > 400) {
      errors.sugar = "Blood sugar should be between 50-400 mg/dL";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!isAuthenticated) {
      setError("Please login to save your vitals");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/vitals/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bp, pulse, sugar }),
      });

      if (res.ok) {
        setOpen(true);
        setSaved(true);
        setError("");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save vitals.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBp(120);
    setPulse(75);
    setSugar(100);
    setFormErrors({});
    setError("");
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { returnTo: "/enter-vitals" } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 6 },
        bgcolor: "#f8f9fa",
        backgroundImage:
          "linear-gradient(135deg, rgba(43, 44, 108, 0.05) 0%, rgba(230, 49, 125, 0.05) 100%)",
        position: "relative",
      }}
    >
      {/* Next Button - Top Right */}
      <Button
        variant="text"
        onClick={() => navigate("/symptom-analysis")}
        startIcon={<NavigateNextIcon />}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#2b2c6c",
          fontWeight: "medium",
          "&:hover": { color: "#e6317d" },
          zIndex: 10,
        }}
      >
        Next: Symptom Analysis
      </Button>

      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <HealthAndSafetyIcon
              sx={{ fontSize: 32, color: "#2b2c6c", mr: 1.5 }}
            />
            <Typography variant="h5" fontWeight="bold" color="#2b2c6c">
              Track Your Health Vitals
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mb: 2 }}
          >
            Regularly monitoring your vital signs helps to track your overall
            health and detect potential issues early. Enter your current
            measurements below.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <MonitorHeartIcon sx={{ mt: 2, mr: 1.5, color: "#e6317d" }} />
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Blood Pressure"
                      type="number"
                      value={bp}
                      onChange={(e) => setBp(Number(e.target.value))}
                      error={!!formErrors.bp}
                      helperText={formErrors.bp}
                      InputProps={{
                        endAdornment: (
                          <Typography color="text.secondary" variant="body2">
                            mmHg
                          </Typography>
                        ),
                      }}
                    />
                    <FormHelperText>
                      Normal range: 90-120 (systolic)
                      <Tooltip title="Blood pressure is the force of blood pushing against artery walls. It's measured in millimeters of mercury (mmHg).">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </FormHelperText>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <TimerIcon sx={{ mt: 2, mr: 1.5, color: "#2fb297" }} />
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Pulse Rate"
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(Number(e.target.value))}
                      error={!!formErrors.pulse}
                      helperText={formErrors.pulse}
                      InputProps={{
                        endAdornment: (
                          <Typography color="text.secondary" variant="body2">
                            bpm
                          </Typography>
                        ),
                      }}
                    />
                    <FormHelperText>
                      Normal range: 60-100 beats per minute
                      <Tooltip title="Pulse rate is the number of times your heart beats per minute. A normal resting heart rate is 60-100 beats per minute.">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </FormHelperText>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <BloodtypeIcon sx={{ mt: 2, mr: 1.5, color: "#e6317d" }} />
                  <Box sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Blood Sugar"
                      type="number"
                      value={sugar}
                      onChange={(e) => setSugar(Number(e.target.value))}
                      error={!!formErrors.sugar}
                      helperText={formErrors.sugar}
                      InputProps={{
                        endAdornment: (
                          <Typography color="text.secondary" variant="body2">
                            mg/dL
                          </Typography>
                        ),
                      }}
                    />
                    <FormHelperText>
                      Normal fasting range: 70-100 mg/dL
                      <Tooltip title="Blood sugar (glucose) is the main sugar found in your blood. Normal fasting blood sugar is less than 100 mg/dL.">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </FormHelperText>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
                sx={{
                  borderColor: "#2b2c6c",
                  color: "#2b2c6c",
                  "&:hover": { borderColor: "#1e1f4b" },
                }}
              >
                Reset Form
              </Button>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading || !isAuthenticated}
                sx={{
                  bgcolor: "#2b2c6c",
                  "&:hover": { bgcolor: "#1e1f4b" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save Vitals"
                )}
              </Button>
            </Box>
          </form>

          {saved && (
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => navigate("/symptom-analysis")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                bgcolor: "#e6317d",
                "&:hover": { bgcolor: "#c62a6a" },
              }}
            >
              Proceed to Symptom Analysis
            </Button>
          )}

          {!isAuthenticated && (
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleLoginRedirect}
              sx={{ mt: 3, borderColor: "#e6317d", color: "#e6317d" }}
            >
              Login to Save Your Vitals
            </Button>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="success"
              onClose={() => setOpen(false)}
              sx={{ width: "100%" }}
            >
              Vitals saved successfully!
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Box>
  );
}

export default VitalsInputForm;
