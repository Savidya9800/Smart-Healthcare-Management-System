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
  
    // Add Logo to Header
    const logoUrl = '/Logo2.png'; // Path to your logo (assuming it's in the public folder)
    doc.addImage(logoUrl, "PNG", 10, 10, 30, 30); // Adjust the size and position as necessary
  
    // Add Title to the Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Registered Patients", 50, 20);
  
    // Add some space between the title and the table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    const headers = [
      "Name",
      "Email",
      "Mobile Number",
      "Gender",
      "Blood Group",
    ];
  
    // Ensure filteredUsers contains the necessary data
    const data = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.mobile,
      user.gender,
      user.bloodGroup 
    ]);
  
    // Add table to PDF
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 40, // Starting position for the table
      margin: { horizontal: 10 },
      theme: "grid",
      didDrawPage: function (data) {
        // Add footer (page number)
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, null, null, "right");
      },
    });
  
    // Save the generated PDF
    doc.save("registered_patients.pdf");
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
