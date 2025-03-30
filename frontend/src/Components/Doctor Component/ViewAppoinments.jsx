import React, { useState, useEffect } from "react";
import DAdminLayout from "./DAdminLayout";
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
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
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search, PictureAsPdf, CheckCircle } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import {autoTable} from 'jspdf-autotable';
import Logo22 from "../../Components/Appointment Component/images/Logo2.png";

function ViewAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  
  // Table states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'upcoming', 'past'
  const [selectedDate, setSelectedDate] = useState('');
  // Removed duplicate handleDiagnosis function
  const handleDiagnosis = (appointmentId) => {
    navigate(`/Doctor-Dashboard/appointmnet/Diagnosis/${appointmentId}`);
  };



  useEffect(() => {
    const storedDoctor = sessionStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appoinment");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data.appoinments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (doctor && appointments.length > 0) {
      let results = appointments.filter(
        (appointment) => appointment.doctor_id === doctor._id
      );

      // Apply search filter
      if (searchTerm) {
        results = results.filter(appointment =>
          (appointment.name && appointment.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (appointment.status && appointment.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (appointment.date && appointment.date.includes(searchTerm)) ||
          (appointment.time && appointment.time.includes(searchTerm))
        );
      }

      // Apply date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          results = results.filter(appointment => {
            const apptDate = new Date(appointment.date);
            return apptDate.toDateString() === today.toDateString();
          });
          break;
        case 'upcoming':
          results = results.filter(appointment => {
            const apptDate = new Date(appointment.date);
            return apptDate >= today;
          });
          break;
        case 'past':
          results = results.filter(appointment => {
            const apptDate = new Date(appointment.date);
            return apptDate < today;
          });
          break;
        case 'specific':
          if (selectedDate) {
            results = results.filter(appointment => 
              appointment.date === selectedDate
            );
          }
          break;
        default:
          // 'all' - no date filtering
          break;
      }

      setFilteredAppointments(results);
    }
  }, [doctor, appointments, searchTerm, dateFilter, selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appoinment/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: "Completed" })
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark appointment as completed");
      }

      // Update the local state to reflect the change
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === appointmentId 
            ? { ...appointment, status: "Completed" } 
            : appointment
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    
   // Modern color palette
        const colors = {
          primary: '#2C3E50',      // Deep midnight blue
          accent: '#3498DB',       // Bright azure blue
          background: '#ECF0F1',   // Light subtle gray
          text: '#2C3E50',         // Dark charcoal
          highlight: '#27AE60'     // Vibrant green
        };
          // Page dimensions
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const margin = 20;
    
          // Background design
          doc.setFillColor(colors.background);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
          // Header Design
          doc.setFillColor(colors.primary);
          doc.rect(0, 0, pageWidth, 30, 'F');
    
          // Logo
          const logoWidth = 30;
          const logoHeight = 30;
          doc.addImage(Logo22, 'PNG', margin, 5, logoWidth, logoHeight);
    
          // Header Text
          doc.setTextColor(255, 255, 255);  // White text
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text('MEDI FLOW', margin + logoWidth + 10, 18);
    
          // Subtitle
          doc.setFontSize(13);
          doc.text('Doctor Appointments', margin + logoWidth + 10, 24);  
    
    // Table
    autoTable(doc,{
      startY: 40,
      head: [['Patient', 'Date', 'Time', 'Status']],
      body: filteredAppointments.map(appointment => [
        appointment.name,
        new Date(appointment.date).toLocaleDateString(),
        appointment.time,
        appointment.status
      ]),
      styles: { 
        font: 'helvetica', 
        fontSize: 12, 
        textColor: colors.text, 
        cellPadding: 3, 
        lineWidth: 0.2, 
        lineColor: colors.primary 
    },
    headStyles: { 
        fillColor: colors.primary, 
        textColor: 255, 
        fontStyle: 'bold' 
    },
    alternateRowStyles: { 
        fillColor: colors.background 
    },
    columnStyles: {
        0: { halign: 'left' }, // Align first column (Leave Type) to left
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' }  // Align status to right
    }
    });
    
    doc.save('doctor_appointments_report.pdf');
  };

  return (
    <DAdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold">My Appointments</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-4">
              <Tooltip title="Generate PDF Report">
                <IconButton 
                  onClick={generateReport}
                  sx={{ backgroundColor: "#4f39f6", color: "white", '&:hover': { backgroundColor: "#3a2bb5" } }}
                >
                  <PictureAsPdf />
                </IconButton>
              </Tooltip>
              
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{ 
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
            </div>

            <div className="flex gap-4">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Date Filter</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Date Filter"
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                  <MenuItem value="specific">Specific Date</MenuItem>
                </Select>
              </FormControl>

              {dateFilter === 'specific' && (
                <TextField
                  type="date"
                  size="small"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150 }}
                />
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredAppointments.length > 0 ? (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>{appointment.indexno}</TableCell>
                        <TableCell>{appointment.name}</TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Box 
                            component="span" 
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 10,
                              backgroundColor: 
                                appointment.status === 'Pending' ? '#fff3e0' :
                                appointment.status === 'Completed' ? '#e8f5e9' :
                                appointment.status === 'Cancelled' ? '#ffebee' : '#f5f5f5',
                              color: 
                                appointment.status === 'Pending' ? '#e65100' :
                                appointment.status === 'Completed' ? '#2e7d32' :
                                appointment.status === 'Cancelled' ? '#c62828' : '#424242',
                              fontWeight: 'medium'
                            }}
                          >
                            {appointment.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleDiagnosis(appointment._id)}
                              sx={{ 
                                backgroundColor: "rgba(79, 57, 246, 0.8)", 
                                color: "white", 
                                borderRadius: 3,
                                '&:hover': { backgroundColor: "rgba(79, 57, 246, 1)" }
                              }}
                            >
                              Diagnosis
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleCompleteAppointment(appointment._id)}
                              disabled={appointment.status === 'Completed'}
                              sx={{ 
                                backgroundColor: "#00cd96", 
                                color: "white", 
                                borderRadius: 3,
                                '&:hover': { backgroundColor: "#00a578" },
                                '&:disabled': { opacity: 0.7 }
                              }}
                              startIcon={<CheckCircle />}
                            >
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAppointments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        ) : (
          <p className="text-gray-500">No appointments found matching your criteria.</p>
        )}
      </div>
    </DAdminLayout>
  );
}

export default ViewAppointments;