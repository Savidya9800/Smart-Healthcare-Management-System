// src/Components/Novelty Component/VitalsInputForm.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

function VitalsInputForm() {
  const [bp, setBp] = useState(120);
  const [pulse, setPulse] = useState(75);
  const [sugar, setSugar] = useState(100);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save vitals.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <Box className="min-h-screen p-6 bg-gray-100">
      <Box className="max-w-xl mx-auto">
        <Paper elevation={3} className="p-6 rounded shadow">
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            🩺 Enter Your Vitals
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Blood Pressure (mmHg)"
              type="number"
              value={bp}
              onChange={(e) => setBp(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Pulse Rate (bpm)"
              type="number"
              value={pulse}
              onChange={(e) => setPulse(Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Blood Sugar (mg/dL)"
              type="number"
              value={sugar}
              onChange={(e) => setSugar(Number(e.target.value))}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Save Vitals
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="success" onClose={() => setOpen(false)}>
              Vitals saved successfully!
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </Box>
  );
}

export default VitalsInputForm;
