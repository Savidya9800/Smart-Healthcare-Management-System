import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DAdminLayout from "./DAdminLayout";
import ViewPrescriptions from './ViewPrescription';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Chip,
  Autocomplete,
  FormControl,
  FormLabel,
  TextareaAutosize,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Save, Cancel, MedicalInformation, Notes, Sick, Add, Close } from '@mui/icons-material';

const DiagnosisForm = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [viewPrescriptionsOpen, setViewPrescriptionsOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    symptoms: [],
    assumedIllness: '',
    diagnosisDescription: '',
    notes: '',
    currentSymptom: ''
  });

  // Prescription state
  const [prescriptionData, setPrescriptionData] = useState({
    medicine: [{ medicineName: '', dosage: '', description: '' }],
    notes: ''
  });

  // Common symptoms for autocomplete
  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea',
    'Dizziness', 'Shortness of breath', 'Chest pain',
    'Body ache', 'Sore throat', 'Runny nose', 'Sneezing'
  ];

  useEffect(() => {
    // Get doctor from session
    const storedDoctor = sessionStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }

    // Fetch appointment details
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appoinment/${appointmentId}`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch appointment details');
        }
        const data = await response.json();
        console.log(data);
        setAppointment(data.appoinment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleAddSymptom = () => {
    if (formData.currentSymptom.trim() && !formData.symptoms.includes(formData.currentSymptom)) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, formData.currentSymptom],
        currentSymptom: ''
      });
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter(symptom => symptom !== symptomToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!doctor || !appointment) return;

    const diagnosisData = {
      appointmentId,
      patientId: appointment.patient_id,
      doctorId: doctor._id,
      symptoms: formData.symptoms,
      assumedIllness: formData.assumedIllness,
      diagnosisDescription: formData.diagnosisDescription,
      notes: formData.notes
    };

    try {
      const response = await fetch('http://localhost:5000/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosisData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit diagnosis');
      }

      // Redirect after successful submission
      navigate('/appointments');
    } catch (err) {
      setError(err.message);
    }
  };

  // Prescription handlers
  const handleAddMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicine: [...prescriptionData.medicine, { medicineName: '', dosage: '', description: '' }]
    });
  };

  const handleRemoveMedicine = (index) => {
    const newMedicine = [...prescriptionData.medicine];
    newMedicine.splice(index, 1);
    setPrescriptionData({
      ...prescriptionData,
      medicine: newMedicine
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicine = [...prescriptionData.medicine];
    newMedicine[index][field] = value;
    setPrescriptionData({
      ...prescriptionData,
      medicine: newMedicine
    });
  };

  const handlePrescriptionSubmit = async () => {
    if (!doctor || !appointment) return;

    const prescriptionPayload = {
      patientId: appointment.patient_id,
      doctorId: doctor._id,
      appointmentId: appointment._id,
      medicine: prescriptionData.medicine.filter(med => 
        med.medicineName.trim() && med.dosage.trim()
      ),
      notes: prescriptionData.notes
    };

    try {
      const response = await fetch('http://localhost:5000/api/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit prescription');
      }

      // Close the prescription dialog
      setPrescriptionOpen(false);
      // Reset prescription form
      setPrescriptionData({
        medicine: [{ medicineName: '', dosage: '', description: '' }],
        notes: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <DAdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Paper elevation={3} className="p-6 sm:p-8 rounded-xl shadow-lg">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-6 rounded-lg mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="font-bold text-2xl sm:text-3xl mb-2">
                    <MedicalInformation className="mr-2" />
                    Patient Diagnosis
                  </Typography>
                  <Typography variant="subtitle1" className="text-indigo-100">
                    Complete the diagnosis form for {appointment?.name || 'the patient'}
                  </Typography>
                </div>
                <div className="hidden md:block bg-white/20 p-3 rounded-full">
                  <Sick className="text-white text-4xl" />
                </div>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Patient Information and Symptoms */}
              <div>
                {/* Patient Card */}
                {appointment && (
                  <div className="mb-8 p-5 bg-white rounded-lg border border-indigo-100 shadow-sm">
                    <Typography variant="h6" className="font-semibold text-lg text-indigo-800 mb-3 flex items-center">
                      <span className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MedicalInformation className="text-indigo-600" />
                      </span>
                      Appointment Details
                    </Typography>
                    <Divider className="my-3" />
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 w-28">Patient:</span>
                        <span className="font-medium text-gray-800">{appointment.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-28">Date:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-28">Time:</span>
                        <span className="font-medium text-gray-800">{appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 w-28">Status:</span>
                        <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                          appointment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-pink-100 text-pink-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Symptoms Section */}
                <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
                  <Typography variant="h6" className="font-semibold text-lg text-indigo-800 mb-3 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Sick className="text-indigo-600" />
                    </span>
                    Symptoms Assessment
                  </Typography>
                  <Divider className="my-3" />
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Autocomplete
                        freeSolo
                        options={commonSymptoms}
                        inputValue={formData.currentSymptom}
                        onInputChange={(e, newValue) => setFormData({...formData, currentSymptom: newValue})}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            size="small"
                            placeholder="Enter symptom"
                            className="flex-grow"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '0.5rem',
                                backgroundColor: 'white'
                              }
                            }}
                          />
                        )}
                        className="flex-grow"
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleAddSymptom}
                        disabled={!formData.currentSymptom.trim()}
                        className="h-10 min-w-[100px] bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Selected Symptoms Chips */}
                    {formData.symptoms.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.symptoms.map((symptom) => (
                          <Chip
                            key={symptom}
                            label={symptom}
                            onDelete={() => handleRemoveSymptom(symptom)}
                            className="bg-pink-100 text-pink-800 rounded-full px-3 py-1 text-sm font-medium"
                            sx={{
                              '& .MuiChip-deleteIcon': {
                                color: '#9d174d',
                                '&:hover': {
                                  color: '#831843'
                                }
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assumed Illness */}
                  <div className="mt-6">
                    <TextField
                      label="Assumed Illness"
                      variant="outlined"
                      fullWidth
                      value={formData.assumedIllness}
                      onChange={(e) => setFormData({...formData, assumedIllness: e.target.value})}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0.5rem',
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Diagnosis Details */}
              <div>
                {/* Diagnosis Description */}
                <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm mb-6">
                  <Typography variant="h6" className="font-semibold text-lg text-indigo-800 mb-3 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Notes className="text-indigo-600" />
                    </span>
                    Diagnosis Details
                  </Typography>
                  <Divider className="my-3" />
                  <FormControl fullWidth className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Clinical Findings & Diagnosis
                    </FormLabel>
                    <TextareaAutosize
                      minRows={8}
                      placeholder="Describe your clinical findings, diagnosis, and any relevant observations..."
                      value={formData.diagnosisDescription}
                      onChange={(e) => setFormData({...formData, diagnosisDescription: e.target.value})}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </FormControl>
                </div>

                {/* Notes & Recommendations */}
                <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
                  <Typography variant="h6" className="font-semibold text-lg text-indigo-800 mb-3 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Notes className="text-indigo-600" />
                    </span>
                    Treatment Plan
                  </Typography>
                  <Divider className="my-3" />
                  <FormControl fullWidth className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Notes & Recommendations
                    </FormLabel>
                    <TextareaAutosize
                      minRows={6}
                      placeholder="Enter treatment recommendations, medications prescribed, follow-up instructions..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    />
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Typography color="error" className="text-sm">
                  {error}
                </Typography>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setPrescriptionOpen(true)}
                className="h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm"
              >
                Add Prescription
              </Button>
              <Button
                variant="outlined"
                startIcon={<Notes />}
                onClick={() => setViewPrescriptionsOpen(true)}
                className="h-11 border-indigo-600 text-indigo-600 hover:border-indigo-700 hover:text-indigo-700"
              >
                View Prescriptions
              </Button>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => navigate(-1)}
                  className="h-11 border-pink-500 text-pink-500 hover:border-pink-600 hover:text-pink-600 rounded-lg"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(236, 72, 153, 0.08)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                  disabled={!formData.symptoms.length || !formData.assumedIllness || !formData.diagnosisDescription}
                >
                  Save Diagnosis
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      </div>

      {/* Prescription Dialog */}
      <Dialog open={prescriptionOpen} onClose={() => setPrescriptionOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center bg-indigo-50">
          <Typography variant="h6" className="font-bold text-indigo-800">
            <MedicalInformation className="mr-2" />
            Add Prescription
          </Typography>
          <IconButton onClick={() => setPrescriptionOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="space-y-6">
            {prescriptionData.medicine.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b pb-4 mb-4">
                <TextField
                  label="Medicine Name"
                  value={med.medicineName}
                  onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={med.description}
                  onChange={(e) => handleMedicineChange(index, 'description', e.target.value)}
                  fullWidth
                />
                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveMedicine(index)}
                    className="h-10"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddMedicine}
              className="mb-4"
            >
              Add Another Medicine
            </Button>
            <TextField
              label="Additional Notes"
              multiline
              rows={4}
              fullWidth
              value={prescriptionData.notes}
              onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
            />
          </div>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={() => setPrescriptionOpen(false)} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handlePrescriptionSubmit} 
            variant="contained" 
            color="primary"
            disabled={!prescriptionData.medicine.some(med => med.medicineName && med.dosage)}
          >
            Save Prescription
          </Button>
        </DialogActions>
      </Dialog>
      <ViewPrescriptions
        open={viewPrescriptionsOpen}
        onClose={() => setViewPrescriptionsOpen(false)}
        appointmentId={appointmentId}
      />

    </DAdminLayout>
    
  );
};

export default DiagnosisForm;