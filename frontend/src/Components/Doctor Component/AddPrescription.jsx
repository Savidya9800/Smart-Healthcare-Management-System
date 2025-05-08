import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Divider,
  Box,
  Paper,
  Grid,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import { Add, Delete, LocalPharmacy, Close, Notes } from '@mui/icons-material';

const AddPrescription = ({ open, onClose, onSubmit, prescriptionData, setPrescriptionData }) => {
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicine];
    updatedMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicine: updatedMedicines });
  };

  const handleAddMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicine: [...prescriptionData.medicine, { medicineName: '', dosage: '', description: '' }]
    });
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = prescriptionData.medicine.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicine: updatedMedicines });
  };

  const handleNotesChange = (e) => {
    setPrescriptionData({ ...prescriptionData, notes: e.target.value });
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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <LocalPharmacy fontSize="medium" />
          <Typography variant="h6" fontWeight="medium">
            New Prescription
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Add medications and instructions for the patient
          </Typography>

          {prescriptionData.medicine.map((med, index) => (
            <Paper 
              key={index} 
              elevation={0}
              sx={{ 
                mb: 3, 
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                position: 'relative'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip 
                  label={`Medicine ${index + 1}`} 
                  color="primary" 
                  size="small"
                  variant="outlined"
                  avatar={<Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>{index + 1}</Avatar>}
                />
                {prescriptionData.medicine.length > 1 && (
                  <IconButton 
                    onClick={() => handleRemoveMedicine(index)} 
                    size="small"
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Medicine Name"
                    value={med.medicineName}
                    onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Instructions"
                    value={med.description}
                    onChange={(e) => handleMedicineChange(index, 'description', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={handleAddMedicine}
            fullWidth
            sx={{
              mt: 1,
              py: 1.5,
              borderStyle: 'dashed',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                borderColor: 'primary.dark'
              }
            }}
          >
            Add Another Medicine
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Notes color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight="medium">
              Additional Notes
            </Typography>
          </Stack>
          <TextField
            label="Special instructions or notes for the patient"
            multiline
            minRows={3}
            value={prescriptionData.notes}
            onChange={handleNotesChange}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderRadius: '6px',
            px: 3,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={
            prescriptionData.medicine.length === 0 || 
            prescriptionData.medicine.some(med => !med.medicineName.trim() || !med.dosage.trim())
          }
          sx={{
            borderRadius: '6px',
            px: 3,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          Save Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPrescription;