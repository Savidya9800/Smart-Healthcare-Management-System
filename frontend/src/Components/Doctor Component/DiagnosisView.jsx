import React, { useState, useEffect } from 'react';
import DAdminLayout from "./DAdminLayout";
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const DiagnosisView = ({ appointmentId, onClose }) => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/diagnosis');
        setDiagnoses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (diagnosis.assumedIllness && diagnosis.assumedIllness.toLowerCase().includes(searchLower)) ||
      (diagnosis.status && diagnosis.status.toLowerCase().includes(searchLower)) ||
      (diagnosis.patientId && diagnosis.patientId.toLowerCase().includes(searchLower)) ||
      (diagnosis.doctorId && diagnosis.doctorId.toLowerCase().includes(searchLower)) ||
      (diagnosis.symptoms && diagnosis.symptoms.some(s => s.toLowerCase().includes(searchLower)))
    );
  });

  const paginatedDiagnoses = filteredDiagnoses.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">Error loading diagnoses: {error}</Typography>
      </Box>
    );
  }

  return (
    <DAdminLayout>
    <Box sx={{ p: 3 }}>
    
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Diagnosis Records
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search diagnoses..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '400px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
           
              <TableCell sx={{ fontWeight: 'bold' }}>Symptoms</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assumed Illness</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDiagnoses.length > 0 ? (
              paginatedDiagnoses.map((diagnosis) => (
                <TableRow key={diagnosis._id}>
                  <TableCell>{diagnosis.patientId || 'Unknown user'}</TableCell>
                  
                  <TableCell>
                    {diagnosis.symptoms.join(', ')}
                  </TableCell>
                  <TableCell>{diagnosis.assumedIllness}</TableCell>
                  <TableCell>
                    <Chip
                      label={diagnosis.status}
                      color={getStatusColor(diagnosis.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(diagnosis.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No diagnoses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredDiagnoses.length > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredDiagnoses.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
    </DAdminLayout>
  );
};

export default DiagnosisView;