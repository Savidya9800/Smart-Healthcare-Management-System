import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  InputLabel,
  FormControl,
  TextField,
  CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import User from "./User";
import UpdateUser from "./UpdateUser";

export default function UsersDetails({ onAddPatientClick }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const adminEmails = [
    "useradmin@gmail.com",
    "pharmacyadmin@gmail.com",
    "doctoradmin@gmail.com",
    "appointmentadmin@gmail.com",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    if (adminEmails.includes(user.email)) return false;

    const matchBlood = bloodGroupFilter
      ? user.bloodGroup === bloodGroupFilter
      : true;
    const matchGender = genderFilter ? user.gender === genderFilter : true;
    const matchDate = dateFilter ? user.registeredDate === dateFilter : true;

    // Enhanced search functionality
    const matchSearch = searchQuery
      ? user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobileNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bloodGroup?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchBlood && matchGender && matchDate && matchSearch;
  });

  const handleGeneratePDF = () => {
    if (filteredUsers.length === 0) {
      alert("No matching patients found for the PDF.");
      return;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: "Registered Patients Report",
      subject: "Patient Registration Details",
      author: "Smart Healthcare Management System",
      keywords: "patients, healthcare, registration, medical records",
      creator: "Smart Healthcare",
    });

    // Add watermark function
    const addWatermark = (doc) => {
      const totalPages = doc.internal.getNumberOfPages();

      // Watermark text
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230); // Light gray
      doc.setFont("helvetica", "bold");

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Position watermark in center of page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set transparency
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.2 }));

        // Add watermark with angle parameter
        doc.text("HEALTHCARE", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: -45,
        });

        doc.restoreGraphicsState();
      }
    };

    // --- HEADER SECTION ---

    // Create top border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(0, 0, doc.internal.pageSize.width, 2, "F");

    // Add colored accent on left side
    doc.setFillColor(47, 178, 151); // #2fb297
    doc.rect(0, 2, 8, 40, "F");

    // Add header text - moved left since logo is removed
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PATIENT REGISTRY", 15, 18);

    // Add sub-header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(47, 178, 151); // #2fb297 - Green color for emphasis
    doc.text("HEALTHCARE MANAGEMENT SYSTEM", 15, 26);

    // Add contact details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Boulevard, Medical District", 15, 32);
    doc.text("Phone: (071) 145-7890 | Email: info@smarthealthcare.com", 15, 36);
    doc.text("www.smarthealthcare.com", 15, 40);

    // Add date in header (right side)
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 195, 15, { align: "right" });

    // Add report summary box
    doc.setFillColor(245, 250, 250); // Light background
    doc.setDrawColor(47, 178, 151); // Green border
    doc.roundedRect(140, 10, 60, 30, 3, 3, "FD"); // Filled rectangle with rounded corners

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(43, 44, 108);
    doc.text("PATIENT REPORT", 170, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Total Patients: ${filteredUsers.length}`, 170, 28, {
      align: "center",
    });

    // Add mini-box for report type
    doc.setFillColor(47, 178, 151, 0.15);
    doc.setDrawColor(47, 178, 151);
    doc.roundedRect(150, 31, 40, 8, 2, 2, "FD");

    doc.setTextColor(47, 178, 151);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("OFFICIAL RECORD", 170, 36, { align: "center" });

    // Add a divider below the header
    doc.setDrawColor(230, 230, 230); // Light gray
    doc.line(10, 50, 200, 50);

    // --- MAIN CONTENT SECTION ---

    // Add title for the table section
    doc.setTextColor(43, 44, 108);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Registered Patients Details", 14, 60);

    // Add subtitle/description
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Complete list of all registered patients in the system with their contact information", 14, 67);

    // Define the table headers and data - remove Registration Date
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Gender",
      "Blood Group"
    ];

    // Ensure filteredUsers contains the necessary data with proper handling for missing values
    const data = filteredUsers.map((user) => {
      // Extended debug logging to specifically check date fields
      console.log("User data:", user);
      
      // Check for mobile number in different possible property names
      const mobileNumber = user.mobileNumber || user.mobile || user.phoneNumber || user.phone || "N/A";
      
      return [
        user.name || "N/A",
        user.email || "N/A",
        mobileNumber,
        user.gender || "N/A",
        user.bloodGroup || "N/A"
      ];
    });

    // Add table to PDF with enhanced styling
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 75,
      margin: { horizontal: 14 },
      headStyles: {
        fillColor: [43, 44, 108],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        textColor: [60, 60, 60],
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 250, 250]
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Make Name column bold
        4: { halign: 'center' }   // Center Blood Group
      },
      didDrawPage: function (data) {
        // Add footer on each page
        const pageHeight = doc.internal.pageSize.height;

        // Create bottom border
        doc.setDrawColor(43, 44, 108);
        doc.setFillColor(43, 44, 108);
        doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 2, "F");

        // Footer text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);

        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = data.pageNumber;

        // Left side - confidentiality notice
        doc.text(
          "CONFIDENTIAL - For authorized personnel only",
          10,
          pageHeight - 12
        );

        // Center - website
        doc.text(
          "www.smarthealthcare.com",
          doc.internal.pageSize.getWidth() / 2,
          pageHeight - 12,
          {
            align: "center",
          }
        );

        // Right - page number and generation date
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 10,
          pageHeight - 12,
          { align: "right" }
        );

        // Add color accent at bottom
        doc.setFillColor(47, 178, 151);
        doc.rect(
          0,
          pageHeight - 5,
          doc.internal.pageSize.width,
          5,
          "F"
        );
      },
    });

    // Add the watermark
    addWatermark(doc);

    // Save the PDF
    doc.save("Registered_Patients_Report.pdf");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        flexDirection="column"
      >
        <CircularProgress sx={{ color: "#2FB297" }} />
        <Typography mt={2} color="#71717D">
          Loading patients...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#f9fafc", minHeight: "100vh" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600} color="#2B2C6C">
          Registered Patients
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Generate PDF Button */}
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePDF}
            sx={{
              backgroundColor: "#2FB297",
              "&:hover": { backgroundColor: "#27a086" },
              borderRadius: "8px",
              textTransform: "none",
              color: "white",
              fontWeight: 500,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              padding: "8px 16px",
            }}
          >
            Generate PDF
          </Button>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "4px 12px",
              border: "1px solid #e0e0e0",
              width: "250px",
            }}
          >
            <SearchIcon sx={{ color: "#71717D", fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                padding: "8px",
                width: "100%",
                background: "transparent",
                fontSize: "14px",
              }}
            />
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#71717D",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              ⌘K
            </Box>
          </Box>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{
              borderColor: "#e0e0e0",
              color: "#71717D",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#828487",
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {showFilters && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={3}
          mt={1}
          sx={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Blood Group</InputLabel>
            <Select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              label="Blood Group"
            >
              <MenuItem value="">All</MenuItem>
              {[
                "O+",
                "O-",
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "Not Specified",
              ].map((bg) => (
                <MenuItem key={bg} value={bg}>
                  {bg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              label="Gender"
            >
              <MenuItem value="">All</MenuItem>
              {["Male", "Female", "Other"].map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Registered Date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Stack>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2FB297" }}>
              <TableCell sx={{ padding: "16px 8px 16px 16px" }} />
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Patient Name
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Email
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Mobile Number
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Registered Date
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Blood Group
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#fff", fontWeight: 600, paddingRight: "24px" }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <User
                  key={user._id}
                  row={user}
                  onUpdate={() => setSelectedUser(user)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ padding: "24px" }}>
                  <Typography color="#71717D">
                    No matching patients found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="#71717D">
          Showing {filteredUsers.length} patients
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            disabled
            variant="outlined"
            sx={{
              borderColor: "#e0e0e0",
              color: "#828487",
              "&.Mui-disabled": {
                color: "#c0c0c0",
                borderColor: "#e0e0e0",
              },
            }}
          >
            Previous
          </Button>
          <Chip
            label="1"
            sx={{
              backgroundColor: "#2FB297",
              color: "#fff",
              fontWeight: 500,
              minWidth: "32px",
            }}
          />
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderColor: "#e0e0e0",
              color: "#828487",
              "&:hover": {
                borderColor: "#2FB297",
                color: "#2FB297",
                backgroundColor: "rgba(47, 178, 151, 0.04)",
              },
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      {selectedUser && (
        <UpdateUser
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUserUpdate}
        />
      )}
    </Box>
  );
}
//* eslint-disable react/prop-types */