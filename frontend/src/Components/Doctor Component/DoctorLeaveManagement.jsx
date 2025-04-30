import React, { useState, useEffect } from 'react';
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
  Box,
} from '@mui/material';
import { Search, PictureAsPdf } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import DAdminLayout from './DAdminLayout';

const DoctorLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentLeaveId, setCurrentLeaveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const leaveTypes = ['Sick Leave', 'Annual Leave', 'Emergency Leave', 'Other'];

  useEffect(() => {
    // Fetch leave data (replace with your API endpoint)
    fetch('http://localhost:5000/api/doctorLeave')
      .then((response) => response.json())
      .then((data) => {
        setLeaves(data);
        setFilteredLeaves(data);
      })
      .catch((error) => console.error('Error fetching leaves:', error));
  }, []);

  useEffect(() => {
    const results = leaves.filter(
      (leave) =>
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.startDate.includes(searchTerm) ||
        leave.endDate.includes(searchTerm)
    );
    setFilteredLeaves(results);
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, leaves]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveDetails({ ...leaveDetails, [name]: value });
  };

  const handleCreateLeave = async () => {
    // API call to create leave
    const response = await fetch('http://localhost:5000/api/doctorLeave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveDetails),
    });
    const newLeave = await response.json();
    setLeaves([...leaves, newLeave]);
    setOpenModal(false);
  };

  const handleEditLeave = (leave) => {
    setLeaveDetails(leave);
    setCurrentLeaveId(leave._id);
    setIsUpdating(true);
    setOpenModal(true);
  };

  const handleUpdateLeave = async () => {
    // API call to update leave
    const response = await fetch(`http://localhost:5000/api/doctorLeave/${currentLeaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveDetails),
    });
    const updatedLeave = await response.json();
    setLeaves(leaves.map((leave) => (leave._id === currentLeaveId ? updatedLeave : leave)));
    setOpenModal(false);
    setIsUpdating(false);
  };

  const handleDeleteLeave = async (id) => {
    // API call to delete leave
    await fetch(`http://localhost:5000/api/doctorLeave/${id}`, { method: 'DELETE' });
    setLeaves(leaves.filter((leave) => leave._id !== id));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Leave Type', 'Start Date', 'End Date', 'Status']],
      body: filteredLeaves.map((leave) => [
        leave.leaveType,
        leave.startDate,
        leave.endDate,
        leave.status,
      ]),
    });
    doc.save('Doctor_Leaves.pdf');
  };

  return (
    <DAdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctor Leave Management</h2>
          <div className="flex gap-4">
            <Tooltip title="Generate PDF">
              <IconButton onClick={generatePDF}>
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
              Create Leave
            </Button>
          </div>
        </div>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
          className="mb-4"
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditLeave(leave)}>Edit</Button>
                    <Button onClick={() => handleDeleteLeave(leave._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLeaves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{isUpdating ? 'Update Leave' : 'Create Leave'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className="mb-4">
            <InputLabel>Leave Type</InputLabel>
            <Select
              name="leaveType"
              value={leaveDetails.leaveType}
              onChange={handleInputChange}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            name="startDate"
            label="Start Date"
            type="date"
            value={leaveDetails.startDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="endDate"
            label="End Date"
            type="date"
            value={leaveDetails.endDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />
          {leaveDetails.leaveType === 'Other' && (
            <TextField
              fullWidth
              name="reason"
              label="Reason"
              value={leaveDetails.reason}
              onChange={handleInputChange}
              className="mb-4"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={isUpdating ? handleUpdateLeave : handleCreateLeave}
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

export default DoctorLeave;