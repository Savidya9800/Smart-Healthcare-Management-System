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
import DeleteIcon from "@mui/icons-material/Delete";
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

const REJECTED_API = "http://localhost:5000/api/rejected-appointments";

function RejectedAppointmentRow({ appointment, onDelete }) {
  const [open, setOpen] = useState(false);

  if (!appointment) {
    return null;
  }

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
          {appointment.indexno || "N/A"}
        </TableCell>
        <TableCell sx={{ fontWeight: "500" }}>
          {appointment.name || "N/A"}
        </TableCell>
        <TableCell align="center">
          <Chip
            icon={<LocalHospitalIcon />}
            label={appointment.specialization || "Unknown"}
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
            {appointment.date
              ? new Date(appointment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ color: colors.gray }} />
            {appointment.time || "N/A"}
          </Box>
        </TableCell>
        <TableCell align="right">
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
            onClick={() => onDelete(appointment._id)}
          >
            <DeleteIcon sx={{ color: colors.pink }} />
          </IconButton>
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
                    Patient ID: {appointment.indexno || "N/A"}
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
                        {appointment.nic || "N/A"}
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
                        {appointment.phone || "N/A"}
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
                        {appointment.email || "N/A"}
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
                        {appointment.address || "N/A"}
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
                      {appointment.doctorName || "N/A"}
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
                      {appointment.specialization || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: "600", color: colors.blue, mb: 2 }}
                >
                  Rejection Details
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
                      Rejected On
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.darkGray }}
                    >
                      {appointment.rejectedAt
                        ? new Date(appointment.rejectedAt).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Rejection Reason
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{ color: colors.darkGray }}
                    >
                      {appointment.rejectionReason || "N/A"}
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
                  onClick={() => onDelete(appointment._id)}
                  sx={{
                    bgcolor: colors.pink,
                    "&:hover": { bgcolor: "#d02b6e" },
                    textTransform: "none",
                  }}
                >
                  Delete Appointment
                </Button>
              </Box>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const RejectedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
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
      console.error("Error fetching rejected appointments:", error);
      throw error;
    }
  };

  const deleteRejectedAppointment = async (id) => {
    try {
      await axios.delete(`${REJECTED_API}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting rejected appointment:", error);
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
    let results = [...appointments];

    if (searchTerm) {
      results = results.filter(
        (appointment) =>
          appointment?.nic?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          appointment?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          appointment?.doctorName
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          appointment?.specialization
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase())
      );
    }

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

  const handleDelete = async (id) => {
    try {
      await deleteRejectedAppointment(id);
      const updatedAppointments = appointments.filter((appt) => appt._id !== id);
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
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Rejected-Appointments-Report-${new Date().toISOString().slice(0, 10)}`,
        subject: "Rejected Appointments Report",
        author: "MediFlow Healthcare System",
        keywords: "rejected appointments, healthcare, report",
        creator: "MediFlow",
      });

      // Add watermark
      const addWatermark = (doc) => {
        const totalPages = doc.internal.getNumberOfPages();
        doc.setFontSize(60);
        doc.setTextColor(230, 230, 230);
        doc.setFont("helvetica", "bold");

        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setGState(new doc.GState({ opacity: 0.2 }));
          doc.text("MEDIFLOW", pageWidth / 2, pageHeight / 2, {
            align: "center",
            angle: -45,
          });
        }
      };

      // --- HEADER SECTION ---
      doc.setDrawColor(43, 44, 108);
      doc.setFillColor(43, 44, 108);
      doc.rect(0, 0, doc.internal.pageSize.width, 2, "F");

      doc.setFillColor(47, 178, 151);
      doc.rect(0, 2, 8, 40, "F");

      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(Logo22, "PNG", 15, 5, logoWidth, logoHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(43, 44, 108);
      doc.text("MEDIFLOW", 15 + logoWidth + 5, 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(47, 178, 151);
      doc.text("HEALTHCARE MANAGEMENT SYSTEM", 15 + logoWidth + 5, 26);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("123 Medical Center Drive, Healthcare City", 15 + logoWidth + 5, 32);
      doc.text("Phone: (123) 456-7890 | Email: support@mediflow.com", 15 + logoWidth + 5, 36);
      doc.text("www.mediflow.com", 15 + logoWidth + 5, 40);

      

      doc.setDrawColor(230, 230, 230);
      doc.line(15, 44, 185, 44);

      doc.setFillColor(245, 250, 250);
      doc.setDrawColor(47, 178, 151);
      doc.roundedRect(140, 10, 60, 30, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(43, 44, 108);
      doc.text("REJECTED APPOINTMENTS", 170, 20, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total: ${filteredAppointments.length} Appointments`, 170, 28, {
        align: "center",
      });

      const statusColor = [47, 178, 151];
      const statusWidth = 40;
      const statusX = 170 - statusWidth / 2;
      doc.setFillColor(...statusColor, 0.15);
      doc.setDrawColor(...statusColor);
      doc.roundedRect(statusX, 31, statusWidth, 8, 2, 2, "FD");

      doc.setTextColor(...statusColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("SUMMARY", 170, 36, { align: "center" });

      doc.setDrawColor(230, 230, 230);
      doc.line(10, 50, 200, 50);

      // --- MAIN CONTENT SECTION ---
      doc.setTextColor(43, 44, 108);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Rejected Appointments Summary", 10, 65);

      let yPos = 80;
      filteredAppointments.forEach((appointment, index) => {
        // --- APPOINTMENT SECTION ---
        doc.setFillColor(240, 240, 250);
        doc.setDrawColor(220, 220, 240);
        doc.roundedRect(10, yPos, 190, 100, 2, 2, "FD");

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(43, 44, 108);
        doc.text(`APPOINTMENT ${appointment.indexno || "N/A"}`, 15, yPos + 10);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        const patientInfo = [
          { label: "Patient Name:", value: appointment.name || "N/A" },
          { label: "NIC:", value: appointment.nic || "N/A" },
          { label: "Phone:", value: appointment.phone || "N/A" },
          { label: "Email:", value: appointment.email || "N/A" },
          { label: "Address:", value: appointment.address || "N/A" },
        ];

        let yPosInner = yPos + 20;
        patientInfo.forEach((info) => {
          doc.setFont("helvetica", "bold");
          doc.text(info.label, 15, yPosInner);
          doc.setFont("helvetica", "normal");
          const splitValue = doc.splitTextToSize(String(info.value), 80);
          doc.text(splitValue, 50, yPosInner);
          yPosInner += 10 + (splitValue.length - 1) * 5;
        });

        const apptInfo = [
          { label: "Doctor:", value: appointment.doctorName || "N/A" },
          { label: "Specialization:", value: appointment.specialization || "N/A" },
          {
            label: "Date:",
            value: appointment.date
              ? new Date(appointment.date).toLocaleDateString("en-GB")
              : "N/A",
          },
          { label: "Time:", value: appointment.time || "N/A" },
          {
            label: "Rejected On:",
            value: appointment.rejectedAt
              ? new Date(appointment.rejectedAt).toLocaleString()
              : "N/A",
          },
          { label: "Rejection Reason:", value: appointment.rejectionReason || "N/A" },
        ];

        yPosInner = yPos + 20;
        apptInfo.forEach((info) => {
          doc.setFont("helvetica", "bold");
          doc.text(info.label, 105, yPosInner);
          doc.setFont("helvetica", "normal");
          const splitValue = doc.splitTextToSize(String(info.value), 80);
          doc.text(splitValue, 140, yPosInner);
          yPosInner += 10 + (splitValue.length - 1) * 5;
        });

        yPos += 110;

        // Check for page break
        if (yPos > doc.internal.pageSize.height - 40) {
          doc.addPage();
          yPos = 20;
        }
      });

      // --- FOOTER SECTION ---
      doc.setDrawColor(43, 44, 108);
      doc.setFillColor(43, 44, 108);
      doc.rect(
        0,
        doc.internal.pageSize.height - 20,
        doc.internal.pageSize.width,
        2,
        "F"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          "Rejected appointments report - Internal use only",
          10,
          doc.internal.pageSize.height - 12
        );
        doc.text(
          "www.mediflow.com",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.height - 12,
          { align: "center" }
        );
        doc.text(
          `Generated: ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 10,
          doc.internal.pageSize.height - 12,
          { align: "right" }
        );
        doc.setFillColor(47, 178, 151);
        doc.rect(
          0,
          doc.internal.pageSize.height - 5,
          doc.internal.pageSize.getWidth(),
          5,
          "F"
        );
      }

      // Add watermark
      addWatermark(doc);

      // Save the PDF
      doc.save(`Rejected-Appointments-Report-${new Date().toISOString().slice(0, 10)}.pdf`);

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
          >
            Rejected Appointments
          </Typography>

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
                startIcon={<PictureAsPdfIcon fontSize="small" />}
                sx={{
                  backgroundColor: "#4f39f6",
                  borderRadius: "8px",
                  color: "white",
                  minWidth: "auto",
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  "& .MuiButton-startIcon": {
                    marginRight: "4px",
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
              placeholder="Search rejected appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableRow sx={{ backgroundColor: colors.pink }}>
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
                    .map((appointment) => (
                      <RejectedAppointmentRow
                        key={appointment?._id}
                        appointment={appointment}
                        onDelete={handleDelete}
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
                            ? "No matching rejected appointments found"
                            : "No Rejected Appointments Found"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm || dateFilter !== "all"
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
                  : snackbarSeverity === "warning"
                  ? "#f4b400"
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