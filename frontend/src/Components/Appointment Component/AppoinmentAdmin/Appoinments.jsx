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
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Collapse,
  Chip,
  Button,
  Card,
  Divider,
  TextField,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
  lightblue: "#2B2C6C",
};

const URL = "http://localhost:5000/api/appoinment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// New function to delete appointments older than a month
const deleteOldAppointments = async (appointmentId) => {
  try {
    await axios.delete(`${URL}/${appointmentId}`);
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return false;
  }
};

function AppointmentRow({ appointment, index, onAccept, onReject }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "#f9f9f9" },
          transition: "background-color 0.3s",
          borderLeft: open
            ? `4px solid ${colors.pink}`
            : "4px solid transparent",
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: "600", color: colors.darkGray }}>
          {appointment.indexno}
        </TableCell>
        <TableCell sx={{ fontWeight: "500" }}>{appointment.name}</TableCell>
        <TableCell align="center">
          <Chip
            icon={<LocalHospitalIcon />}
            label={appointment.specialization}
            size="small"
            sx={{
              bgcolor: `${colors.blue}20`,
              color: colors.blue,
              fontWeight: "500",
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventIcon fontSize="small" sx={{ color: colors.gray }} />
            {new Date(appointment.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ color: colors.gray }} />
            {appointment.time}
          </Box>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <IconButton
              sx={{
                backgroundColor: `${colors.green}20`,
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: `${colors.green}30`,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => onAccept(index)}
            >
              <CheckCircleIcon sx={{ color: colors.green }} />
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: `${colors.pink}20`,
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: `${colors.pink}30`,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => onReject(index)}
            >
              <CancelIcon sx={{ color: colors.pink }} />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ paddingY: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card
              sx={{
                m: 2,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #eaecef",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "600", color: colors.blue }}
                >
                  Patient Details
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" sx={{ color: colors.gray }} />
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {appointment.indexno}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: `${colors.blue}10`,
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCardIcon sx={{ color: colors.blue }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        NIC
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: colors.darkGray }}
                      >
                        {appointment.nic}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: `${colors.green}10`,
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhoneIcon sx={{ color: colors.green }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: colors.darkGray }}
                      >
                        {appointment.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: `${colors.pink}10`,
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EmailIcon sx={{ color: colors.pink }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: colors.darkGray }}
                      >
                        {appointment.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: `${colors.darkGray}10`,
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HomeIcon sx={{ color: colors.darkGray }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: colors.darkGray }}
                        noWrap
                      >
                        {appointment.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: "600", color: colors.blue, mb: 2 }}
                >
                  Doctor Information
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Doctor Name
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.darkGray }}
                    >
                      {appointment.doctorName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Specialization
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.darkGray }}
                    >
                      {appointment.specialization}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8f9fa",
                  borderTop: "1px solid #eaecef",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: colors.gray,
                    color: colors.gray,
                    "&:hover": {
                      borderColor: colors.darkGray,
                      color: colors.darkGray,
                    },
                  }}
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onAccept(index)}
                  sx={{
                    bgcolor: colors.pink,
                    "&:hover": { bgcolor: "#d02b6e" },
                    textTransform: "none",
                  }}
                >
                  Accept Appointment
                </Button>
              </Box>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [deletedCount, setDeletedCount] = useState(0);

  // Function to check if an appointment is older than a month
  const isOlderThanOneMonth = (appointmentDate) => {
    const today = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    return new Date(appointmentDate) < oneMonthAgo;
  };

  // Function to cleanup old appointments
  const cleanupOldAppointments = async (appointmentsData) => {
    let deletedCounter = 0;
    const currentAppointments = [...appointmentsData];
    const appointmentsToKeep = [];

    // Find appointments older than a month
    for (const appointment of currentAppointments) {
      if (isOlderThanOneMonth(appointment.date)) {
        // Delete old appointment from the database
        const deleted = await deleteOldAppointments(appointment._id);
        if (deleted) {
          deletedCounter++;
        } else {
          appointmentsToKeep.push(appointment); // Keep it in the list if deletion failed
        }
      } else {
        appointmentsToKeep.push(appointment);
      }
    }

    setDeletedCount(deletedCounter);

    // Update state with appointments that are not deleted
    if (deletedCounter > 0) {
      setAppointments(appointmentsToKeep);
      setSnackbarMessage(
        `${deletedCounter} old appointment(s) automatically removed`
      );
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    }

    return appointmentsToKeep;
  };

  useEffect(() => {
    fetchHandler()
      .then((data) => {
        const fetchedAppointments = data.appoinments;
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments);

        // Clean up old appointments
        cleanupOldAppointments(fetchedAppointments);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setSnackbarMessage("Failed to fetch appointments");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      });

    // Set interval to check for old appointments daily
    const cleanupInterval = setInterval(() => {
      if (appointments.length > 0) {
        cleanupOldAppointments(appointments);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    let results = [...appointments];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (appointment) =>
          appointment.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.doctorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        results = results.filter((appointment) => {
          const apptDate = new Date(appointment.date);
          return apptDate.toDateString() === today.toDateString();
        });
        break;
      case "upcoming":
        results = results.filter((appointment) => {
          const apptDate = new Date(appointment.date);
          return apptDate >= today;
        });
        break;
      case "past":
        results = results.filter((appointment) => {
          const apptDate = new Date(appointment.date);
          return apptDate < today;
        });
        break;
      case "specific":
        if (selectedDate) {
          results = results.filter(
            (appointment) => appointment.date === selectedDate
          );
        }
        break;
      default:
        break;
    }

    setFilteredAppointments(results);
    setPage(0);
  }, [appointments, searchTerm, dateFilter, selectedDate]);

  const handleAccept = (index) => {
    // Clone the appointments array
    const updatedAppointments = [...appointments];

    // Update the status if needed
    if (updatedAppointments[index]) {
      updatedAppointments[index].status = "Accepted";
      setAppointments(updatedAppointments);
    }

    setSnackbarMessage("Appointment accepted successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    // Here you would typically make an API call to update the status in your database
    // For example:
    // axios.put(`${URL}/${updatedAppointments[index]._id}`, {
    //   status: "Accepted"
    // }).catch(error => {
    //   console.error("Error updating appointment:", error);
    //   setSnackbarMessage("Failed to update appointment status");
    //   setSnackbarSeverity("error");
    //   setOpenSnackbar(true);
    // });
  };

  const handleReject = (index) => {
    // Clone the appointments array
    const updatedAppointments = [...appointments];

    // Update the status if needed
    if (updatedAppointments[index]) {
      updatedAppointments[index].status = "Rejected";
      setAppointments(updatedAppointments);
    }

    setSnackbarMessage("Appointment rejected.");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);

    // Here you would typically make an API call to update the status in your database
    // For example:
    // axios.put(`${URL}/${updatedAppointments[index]._id}`, {
    //   status: "Rejected"
    // }).catch(error => {
    //   console.error("Error updating appointment:", error);
    //   setSnackbarMessage("Failed to update appointment status");
    //   setSnackbarSeverity("error");
    //   setOpenSnackbar(true);
    // });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // PDF Generation function to add to your existing code
  const generateReport = async () => {
    try {
      // Create PDF document directly (no need for dynamic import)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Color scheme
      const colors = {
        primary: "#2C3E50",
        accent: "#3498DB",
        background: "#ECF0F1",
        text: "#2C3E50",
        highlight: "#27AE60",
      };

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // Background
      doc.setFillColor(colors.background);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Header with color
      doc.setFillColor(colors.primary);
      doc.rect(0, 0, pageWidth, 30, "F");

      // Add logo
      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(Logo22, "PNG", margin, 5, logoWidth, logoHeight);

      // Header text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MEDI FLOW", margin + logoWidth + 10, 18);

      doc.setFontSize(13);
      doc.text("Appointments Report", margin + logoWidth + 10, 24);

      // Report title
      doc.setFontSize(18);
      doc.setTextColor(colors.primary);
      doc.text("Appointments List", margin, 50);

      // Title underline
      doc.setLineWidth(0.5);
      doc.setDrawColor(colors.accent);
      doc.line(margin, 55, pageWidth - margin, 55);

      // Table setup
      let yPosition = 65;
      // Updated column widths to match all 7 columns
      const colWidths = [15, 35, 30, 35, 30, 25]; // ID, Name, NIC, Doctor Name, Specialization, Date, Time
      const rowHeight = 10;

      // Draw table headers
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);

      // Header background
      doc.setFillColor(colors.primary);
      doc.rect(margin, yPosition, pageWidth - margin * 2, rowHeight, "F");

      // Header text
      let xPosition = margin;
      const headers = [
        "ID",
        "Patient Name",
        "NIC",
        "Doctor Name",
        "Specialization",
        "Date",
      ];
      headers.forEach((header, i) => {
        doc.text(
          header,
          xPosition + colWidths[i] / 2,
          yPosition + rowHeight / 2 + 3,
          { align: "center" }
        );
        xPosition += colWidths[i];
      });
      yPosition += rowHeight;

      // Draw table rows
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text);

      filteredAppointments.forEach((appointment, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240);
        } else {
          doc.setFillColor(255, 255, 255);
        }

        // Draw row background
        doc.rect(margin, yPosition, pageWidth - margin * 2, rowHeight, "F");

        // Draw cell borders
        doc.setDrawColor(200, 200, 200);
        xPosition = margin;
        colWidths.forEach((width) => {
          doc.line(xPosition, yPosition, xPosition, yPosition + rowHeight);
          xPosition += width;
        });
        doc.line(xPosition, yPosition, xPosition, yPosition + rowHeight); // Final line

        // Add row data
        xPosition = margin;
        const rowData = [
          appointment.indexno || "N/A",
          appointment.name || "N/A",
          appointment.nic || "N/A",
          appointment.doctorName || "N/A", // Fixed typo here
          appointment.specialization || "N/A",
          appointment.date
            ? new Date(appointment.date).toLocaleDateString()
            : "N/A",
        ];

        rowData.forEach((text, i) => {
          // Trim text if too long
          const maxLength = Math.floor(colWidths[i] / 2.5);
          const displayText =
            text.length > maxLength
              ? text.substring(0, maxLength) + "..."
              : text;

          doc.text(displayText, xPosition + 2, yPosition + rowHeight / 2 + 3, {
            align: "left",
          });
          xPosition += colWidths[i];
        });

        yPosition += rowHeight;

        // Add new page if needed
        if (yPosition > pageHeight - 30) {
          // Footer for current page
          addFooter(doc, colors, pageWidth, pageHeight, margin);

          doc.addPage();
          yPosition = 20;

          // Header for new page
          doc.setFillColor(colors.primary);
          doc.rect(0, 0, pageWidth, 30, "F");
          doc.addImage(Logo22, "PNG", margin, 5, logoWidth, logoHeight);
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(13);
          doc.text(
            "Appointments Report (Continued)",
            margin + logoWidth + 10,
            24
          );

          // Reset yPosition after header
          yPosition = 50;
        }
      });

      // Add final footer
      addFooter(doc, colors, pageWidth, pageHeight, margin);

      // Save the PDF
      doc.save(
        `appointments_report_${new Date().toISOString().slice(0, 10)}.pdf`
      );

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
  // Helper function for footer
  const addFooter = (doc, colors, pageWidth, pageHeight, margin) => {
    doc.setLineWidth(0.2);
    doc.setDrawColor(colors.primary);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    doc.setFontSize(8);
    doc.setTextColor(colors.text);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      margin,
      pageHeight - 10
    );
    doc.text("Confidential Document", pageWidth - margin - 40, pageHeight - 10);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "67vh" }}>
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
              color: colors.blue,
              borderBottom: `3px solid ${colors.pink}`,
              display: "inline-block",
              pb: 1,
            }}
          ></Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Tooltip title="Generate PDF Report">
              <Button
                variant="contained"
                onClick={generateReport}
                startIcon={<PictureAsPdfIcon fontSize="small" />} // Smaller icon
                sx={{
                  backgroundColor: "#4f39f6",
                  borderRadius: "8px",
                  color: "white",
                  minWidth: "auto", // Removes minimum width constraint
                  padding: "4px 8px", // Tighter padding (vertical, horizontal)
                  fontSize: "0.75rem", // Smaller text
                  "& .MuiButton-startIcon": {
                    marginRight: "4px", // Reduce icon spacing
                  },
                  "&:hover": {
                    backgroundColor: "#3a2bb5",
                  },
                }}
              >
                PDF
              </Button>
            </Tooltip>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
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

              {dateFilter === "specific" && (
                <TextField
                  type="date"
                  size="small"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150 }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Card
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.green }}>
                  <TableCell
                    width="50px"
                    sx={{ color: colors.white }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                  >
                    Appointment ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                  >
                    Patient Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                    align="center"
                  >
                    Specialization
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      color: colors.white,
                    }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appointment, index) => (
                      <AppointmentRow
                        key={index}
                        appointment={appointment}
                        index={index}
                        onAccept={handleAccept}
                        onReject={handleReject}
                      />
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                          <EventIcon
                            sx={{ fontSize: 40, color: colors.gray }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ color: colors.darkGray }}
                        >
                          {searchTerm || dateFilter !== "all"
                            ? "No matching appointments found"
                            : "No Appointments Found"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm || dateFilter !== "all"
                            ? "Try different search criteria"
                            : "New appointment requests will appear here"}
                        </Typography>
                        {deletedCount > 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {deletedCount} old appointment(s) were automatically
                            removed
                          </Typography>
                        )}
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
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
}

export default Appointments;
