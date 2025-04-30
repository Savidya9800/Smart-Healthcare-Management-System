import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import DAdminLayout from './DAdminLayout';

const DoctorPrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState({
    patientName: '',
    medication: '',
    dosage: '',
    instructions: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch prescription data (replace with your API endpoint)
    fetch('http://localhost:5000/api/prescription')
      .then((response) => response.json())
      .then((data) => {
        setPrescriptions(data);
        setFilteredPrescriptions(data);
      })
      .catch((error) => console.error('Error fetching prescriptions:', error));
  }, []);

  useEffect(() => {
    const results = prescriptions.filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrescriptions(results);
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, prescriptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionDetails({ ...prescriptionDetails, [name]: value });
  };

  const handleCreatePrescription = async () => {
    // API call to create prescription
    const response = await fetch('http://localhost:5000/api/prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescriptionDetails),
    });
    const newPrescription = await response.json();
    setPrescriptions([...prescriptions, newPrescription]);
    setOpenModal(false);
  };

  const handleEditPrescription = (prescription) => {
    setPrescriptionDetails(prescription);
    setCurrentPrescriptionId(prescription._id);
    setIsUpdating(true);
    setOpenModal(true);
  };

  const handleUpdatePrescription = async () => {
    // API call to update prescription
    const response = await fetch(`http://localhost:5000/api/prescription/${currentPrescriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescriptionDetails),
    });
    const updatedPrescription = await response.json();
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription._id === currentPrescriptionId ? updatedPrescription : prescription
      )
    );
    setOpenModal(false);
    setIsUpdating(false);
  };

  const handleDeletePrescription = async (id) => {
    // API call to delete prescription
    await fetch(`http://localhost:5000/api/prescription/${id}`, { method: 'DELETE' });
    setPrescriptions(prescriptions.filter((prescription) => prescription._id !== id));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DAdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctor Prescription Management</h2>
          <Tooltip title="Add Prescription">
            <IconButton onClick={() => setOpenModal(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        </div>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Patient Name or Medication..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Instructions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrescriptions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((prescription) => (
                  <TableRow key={prescription._id}>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.instructions}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditPrescription(prescription)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePrescription(prescription._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPrescriptions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{isUpdating ? 'Update Prescription' : 'Create Prescription'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            name="patientName"
            label="Patient Name"
            value={prescriptionDetails.patientName}
            onChange={handleInputChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="medication"
            label="Medication"
            value={prescriptionDetails.medication}
            onChange={handleInputChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="dosage"
            label="Dosage"
            value={prescriptionDetails.dosage}
            onChange={handleInputChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="instructions"
            label="Instructions"
            value={prescriptionDetails.instructions}
            onChange={handleInputChange}
            className="mb-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={isUpdating ? handleUpdatePrescription : handleCreatePrescription}
            variant="contained"
            color="primary"
          >
            {isUpdating ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </DAdminLayout>
  );
};

export default DoctorPrescriptionManagement;