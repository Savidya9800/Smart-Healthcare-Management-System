import React, { useState, useEffect } from 'react';
import DAdminLayout from "./DAdminLayout";

import { 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
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
  Box
} from '@mui/material';
import { Search, PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import Logo22 from "../../Components/Appointment Component/images/Logo2.png"


const DoctorLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [status, setStatus] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentLeaveId, setCurrentLeaveId] = useState(null);
  
  
  // Table states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const leaveTypes = ["Sick Leave", "Annual Leave", "Emergency Leave", "Other"];

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  useEffect(() => {
    if(doctor){
    fetch(`http://localhost:5000/api/doctorLeave/filterBydoc/${doctor._id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
            console.log("No leave records found.");
            setLeaves([]);
            setFilteredLeaves([]);
          } else {
            setLeaves(data);
            setFilteredLeaves(data);
          }
      })
      .catch((error) => console.error('Error fetching leaves:', error));}
  }, [doctor,status]);

  useEffect(() => {
    const results = leaves.filter(leave =>
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.startDate.includes(searchTerm) ||
      leave.endDate.includes(searchTerm)
    );
    setFilteredLeaves(results);
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, leaves]);

  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    if (leaveDetails.startDate < today) {
      setError("Start date cannot be before today's date.");
      return false;
    }
    if (leaveDetails.endDate <= leaveDetails.startDate) {
      setError("End date must be later than the start date.");
      return false;
    }

    
    // Check for overlapping leave requests
    const overlappingLeave = leaves.some(leave => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        const newLeaveStart = new Date(leaveDetails.startDate);
        const newLeaveEnd = new Date(leaveDetails.endDate);
  
        // Check if the new leave period overlaps with an existing one
        return (
          (newLeaveStart <= leaveEnd && newLeaveStart >= leaveStart) || 
          (newLeaveEnd <= leaveEnd && newLeaveEnd >= leaveStart) ||
          (newLeaveStart <= leaveStart && newLeaveEnd >= leaveEnd) ||
          (newLeaveStart >= leaveStart && newLeaveEnd <= leaveEnd)
        );
      });
  
      if (overlappingLeave) {
        setError("The leave period overlaps with an existing leave request.");
        return false;
      }
  
    setError("");
    return true;
  };

  const handleUpdateStatus = async (leaveId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctorLeave/${leaveId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedLeave = await response.json();
      setStatus(updatedLeave.status);
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    try {
      await fetch(`http://localhost:5000/api/doctorLeave/${leaveId}`, {
        method: 'DELETE',
      });
      setStatus('');
    } catch (error) {
      console.error('Error deleting leave request:', error);
    }
  };

  const handleUpdateLeave = async (e) => {
    e.preventDefault();
    if (!doctor) {
      console.error('Doctor data is not available');
      return;
    }
    if (!validateDates()) return;

    const leaveData = {
      doctorId: doctor._id,
      leaveType: leaveDetails.leaveType,
      startDate: leaveDetails.startDate,
      endDate: leaveDetails.endDate,
      reason: leaveDetails.leaveType === "Other" ? leaveDetails.reason : "",
    };

    try {
      const response = await fetch(`http://localhost:5000/api/doctorLeave/${currentLeaveId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData),
      });
      await response.json();
      setStatus('Pending');
      setLeaveDetails({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      setIsUpdating(false);
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!doctor) {
      console.error('Doctor data is not available');
      return;
    }
    if (!validateDates()) return;
    const leaveData = {
      doctorId: doctor._id,
      leaveType: leaveDetails.leaveType,
      startDate: leaveDetails.startDate,
      endDate: leaveDetails.endDate,
      reason: leaveDetails.leaveType === "Other" ? leaveDetails.reason : "",
    };

    try {
      const response = await fetch('http://localhost:5000/api/doctorLeave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData),
      });
      await response.json();
      setStatus('Pending');
      setLeaveDetails({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating leave request:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails({ ...leaveDetails, [name]: value });
  };

  const handleEditLeave = (leave) => {
    setLeaveDetails({
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
    });
    setCurrentLeaveId(leave._id);
    setIsUpdating(true);
    setOpenModal(true);
  };

  // Table pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
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
        doc.text('Leaves Statement', margin + logoWidth + 10, 24);      

     
    // Add the table using the autoTable plugin
    autoTable(doc, {
        startY: 50,
        margin: { top: 50 },
        head: [['Leave Type', 'Start Date', 'End Date', 'Status']],
        body: filteredLeaves.map((leave, index) => [
            leave.leaveType,
            new Date(leave.startDate).toLocaleDateString(),
            new Date(leave.endDate).toLocaleDateString(),
            leave.status
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
    
    
    doc.save('doctor_leave_report.pdf');
  };


  return (
    <DAdminLayout>
      <div className="leave-manager mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{ backgroundColor: "#4f39f6", color: "white", borderRadius: 3 }}
            >
              <span className="text-lg mr-3">+</span> Create Leave Request
            </Button>
            
            <Tooltip title="Generate PDF Report">
              <IconButton 
                onClick={generateReport}
                sx={{ backgroundColor: "#4f39f6", color: "white", '&:hover': { backgroundColor: "#3a2bb5" } }}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          </div>
          
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search leaves..."
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

        {/* Modal for Leave Request Form */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>{isUpdating ? "Update" : "Create"} Leave Request</DialogTitle>
          <DialogContent>
            {error && <p className="text-red-500">{error}</p>}

            <FormControl fullWidth variant="outlined" className="mb-4">
              <InputLabel>Leave Type</InputLabel>
              <Select label="Leave Type" name="leaveType" value={leaveDetails.leaveType} onChange={handleInputChange}>
                {leaveTypes.map((leaveType, index) => (
                  <MenuItem key={index} value={leaveType}>{leaveType}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth label="Start Date" type="date" name="startDate" value={leaveDetails.startDate}
              onChange={handleInputChange} variant="outlined" InputLabelProps={{ shrink: true }} className="mb-4" />

            <TextField fullWidth label="End Date" type="date" name="endDate" value={leaveDetails.endDate}
              onChange={handleInputChange} variant="outlined" InputLabelProps={{ shrink: true }} className="mb-4" />

            {leaveDetails.leaveType === "Other" && (
              <TextField fullWidth label="Reason" name="reason" value={leaveDetails.reason}
                onChange={handleInputChange} variant="outlined" className="mb-4" />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={isUpdating ? handleUpdateLeave : handleCreateLeave} variant="contained" color="primary">
              {isUpdating ? "Update Leave Request" : "Submit Leave Request"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Material-UI Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaves
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 10,
                          backgroundColor: 
                            leave.status === 'Pending' ? '#fff3e0' :
                            leave.status === 'Approved' ? '#e8f5e9' :
                            leave.status === 'Rejected' ? '#ffebee' :
                            leave.status === 'Ongoing' ? '#e3f2fd' : '#f5f5f5',
                          color: 
                            leave.status === 'Pending' ? '#e65100' :
                            leave.status === 'Approved' ? '#2e7d32' :
                            leave.status === 'Rejected' ? '#c62828' :
                            leave.status === 'Ongoing' ? '#1565c0' : '#424242',
                          fontWeight: 'medium'
                        }}
                      >
                        {leave.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditLeave(leave)}
                          sx={{ 
                            backgroundColor: "rgba(79, 57, 246, 0.8)", 
                            color: "white", 
                            borderRadius: 3, 
                            border: "none",
                            '&:hover': { backgroundColor: "rgba(79, 57, 246, 1)" }
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleUpdateStatus(leave._id, 'Ongoing')}
                          sx={{ 
                            backgroundColor: "#00cd96", 
                            color: "white", 
                            borderRadius: 3, 
                            border: "none",
                            '&:hover': { backgroundColor: "#00a578" }
                          }}
                        >
                          Start
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleUpdateStatus(leave._id, 'Taken')}
                          sx={{ 
                            backgroundColor: "#ff822e", 
                            color: "white", 
                            borderRadius: 3, 
                            border: "none",
                            '&:hover': { backgroundColor: "#e67329" }
                          }}
                        >
                          End
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteLeave(leave._id)}
                          sx={{ 
                            backgroundColor: "#fd0070", 
                            color: "white", 
                            borderRadius: 3, 
                            border: "none",
                            '&:hover': { backgroundColor: "#d6005e" }
                          }}
                        >
                          Delete
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
            count={filteredLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </DAdminLayout>
  );
};

export default DoctorLeave;