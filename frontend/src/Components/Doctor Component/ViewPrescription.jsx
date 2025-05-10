// File: components/ViewPrescriptions.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Divider,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { Close, LocalPharmacy, MedicalServices, Event, Notes } from '@mui/icons-material';

const ViewPrescriptions = ({ open, onClose, appointmentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchPrescriptions();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchPrescriptions();
    }
  }, [open]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/prescription/');
      const data = await response.json();
      const filtered = data.filter(p => p.appointmentId === appointmentId);
      setPrescriptions(filtered);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <Stack direction="row" alignItems="center" spacing={2}>
          <LocalPharmacy fontSize="medium" />
          <Typography variant="h6" className="font-bold">
            Patient Prescriptions
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box p={4} textAlign="center">
            <Typography color="error">{error}</Typography>
            <Button 
              variant="outlined" 
              onClick={fetchPrescriptions}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : prescriptions.length === 0 ? (
          <Box p={4} textAlign="center">
            <MedicalServices sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No prescriptions found
            </Typography>
            <Typography color="textSecondary">
              No prescriptions have been created for this appointment yet.
            </Typography>
          </Box>
        ) : (
          <Box>
            {prescriptions.map((prescription) => (
              <Paper 
                key={prescription._id} 
                elevation={0} 
                sx={{ 
                  m: 3, 
                  p: 3, 
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Event sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {new Date(prescription.dateIssued).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Stack>
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Dosage</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Instructions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescription.medicine.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography fontWeight="medium">{med.medicineName}</Typography>
                          </TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {prescription.notes && (
                  <Box mt={3}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Notes color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Doctor's Notes
                      </Typography>
                    </Stack>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50',
                        borderRadius: '6px'
                      }}
                    >
                      <Typography variant="body2">{prescription.notes}</Typography>
                    </Paper>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewPrescriptions;