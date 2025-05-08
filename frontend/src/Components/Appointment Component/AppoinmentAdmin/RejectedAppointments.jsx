import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  TablePagination,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Event as EventIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Logo22 from "../../Appointment Component/images/Logo2.png";

const colors = {
  darkGray: "#71717D",
  gray: "#828487",
  pink: "#E6317D",
  white: "#FFFFFF",
  blue: "#2B2C6C",
  green: "#2FB297",
};

const REJECTED_API = "http://localhost:5000/api/rejected-appointments";

const RejectedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchRejectedAppointments = async () => {
    try {
      const response = await axios.get(REJECTED_API);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching rejected appointments:', error);
      throw error;
    }
  };

  const deleteRejectedAppointment = async (id) => {
    try {
      await axios.delete(`${REJECTED_API}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting rejected appointment:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRejectedAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
        setLoading(false);
      } catch (error) {
        setSnackbarMessage("Failed to fetch rejected appointments");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = appointments.filter(
        (appointment) =>
          appointment.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAppointments(results);
    } else {
      setFilteredAppointments(appointments);
    }
    setPage(0);
  }, [searchTerm, appointments]);

  const handleDelete = async (id) => {
    try {
      await deleteRejectedAppointment(id);
      const updatedAppointments = appointments.filter(appt => appt._id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      setSnackbarMessage("Rejected appointment deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete rejected appointment");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const generateReport = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header
      doc.setFillColor(colors.pink);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");
      
      // Logo and title
      const logoWidth = 30;
      doc.addImage(Logo22, "PNG", 20, 5, logoWidth, logoWidth);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MEDI FLOW", 60, 20);
      doc.setFontSize(13);
      doc.text("Rejected Appointments Report", 60, 26);

      // Table data
      const headers = ["ID", "Patient", "Doctor", "Specialization", "Date", "Time", "Rejected On", "Reason"];
      const data = filteredAppointments.map(appt => [
        appt.indexno || "N/A",
        appt.name || "N/A",
        appt.doctorName || "N/A",
        appt.specialization || "N/A",
        appt.date ? new Date(appt.date).toLocaleDateString() : "N/A",
        appt.time || "N/A",
        appt.rejectedAt ? new Date(appt.rejectedAt).toLocaleString() : "N/A",
        appt.rejectionReason || "N/A"
      ]);

      // Generate table
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        headStyles: {
          fillColor: colors.blue,
          textColor: colors.white,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(colors.darkGray);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        20,
        doc.internal.pageSize.getHeight() - 10
      );

      doc.save(`rejected_appointments_${new Date().toISOString().slice(0, 10)}.pdf`);
      setSnackbarMessage("PDF report generated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setSnackbarMessage(`Failed to generate PDF: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", minHeight: "67vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 600, 
          color: colors.blue, 
          borderBottom: `3px solid ${colors.pink}`, 
          display: "inline-block", 
          pb: 1 
        }}>
          Rejected Appointments
        </Typography>

        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          mb: 3, 
          flexDirection: { xs: "column", sm: "row" }, 
          gap: 2 
        }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search rejected appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: 250, 
              "& .MuiOutlinedInput-root": { borderRadius: 3 } 
            }}
          />

          <Tooltip title="Generate PDF Report">
            <Button
              variant="contained"
              onClick={generateReport}
              startIcon={<PictureAsPdfIcon fontSize="small" />}
              sx={{
                backgroundColor: "#4f39f6",
                borderRadius: "8px",
                color: "white",
                minWidth: "auto",
                padding: "4px 8px",
                fontSize: "0.75rem",
                "& .MuiButton-startIcon": { marginRight: "4px" },
                "&:hover": { backgroundColor: "#3a2bb5" },
              }}
            >
              PDF
            </Button>
          </Tooltip>
        </Box>

        <Card sx={{ 
          borderRadius: "16px", 
          overflow: "hidden", 
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)" 
        }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: colors.pink }}>
                <TableRow>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Doctor</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Specialization</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Rejected On</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ color: colors.white, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>{appointment.indexno || "N/A"}</TableCell>
                        <TableCell>{appointment.name || "N/A"}</TableCell>
                        <TableCell>{appointment.doctorName || "N/A"}</TableCell>
                        <TableCell>{appointment.specialization || "N/A"}</TableCell>
                        <TableCell>
                          {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{appointment.time || "N/A"}</TableCell>
                        <TableCell>
                          {appointment.rejectedAt ? new Date(appointment.rejectedAt).toLocaleString() : "N/A"}
                        </TableCell>
                        <TableCell>{appointment.rejectionReason || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDelete(appointment._id)}
                            sx={{
                              color: colors.pink,
                              "&:hover": { color: "#d02b6e" },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            bgcolor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <EventIcon sx={{ fontSize: 40, color: colors.gray }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: colors.darkGray }}>
                          {searchTerm
                            ? "No matching rejected appointments found"
                            : "No Rejected Appointments Found"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm
                            ? "Try different search criteria"
                            : "Rejected appointments will appear here"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
              borderRadius: "10px",
              bgcolor:
                snackbarSeverity === "success"
                  ? colors.green
                  : snackbarSeverity === "info"
                  ? colors.blue
                  : colors.pink,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default RejectedAppointments;