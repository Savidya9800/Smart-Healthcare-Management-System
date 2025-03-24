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
import AddIcon from "@mui/icons-material/Add";
import User from "./User";
import UpdateUser from "./UpdateUser";

export default function UsersDetails() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Filters
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchBlood = bloodGroupFilter ? user.bloodGroup === bloodGroupFilter : true;
    const matchGender = genderFilter ? user.gender === genderFilter : true;
    const matchDate = dateFilter ? user.registeredDate === dateFilter : true;
    return matchBlood && matchGender && matchDate;
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        flexDirection="column"
      >
        <CircularProgress color="primary" />
        <Typography mt={2} color="gray">
          Loading patients...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600} color="#1F295A">
          Registered Patients
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{
              borderColor: "#D9D9D9",
              color: "#444",
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#2FB297",
              "&:hover": { backgroundColor: "#28a68b" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add New Patient
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Stack direction="row" spacing={2} mb={3} mt={1}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Blood Group</InputLabel>
            <Select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              label="Blood Group"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="Not Specified">Not Specified</MenuItem>
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
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2FB297" }}>
              <TableCell />
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Patient Name</TableCell>
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
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <User key={user._id} row={user} onUpdate={() => setSelectedUser(user)} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="gray">
          Showing {filteredUsers.length} patients
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button size="small" disabled variant="outlined">
            Previous
          </Button>
          <Chip label="1" sx={{ backgroundColor: "#2FB297", color: "#fff" }} />
          <Button size="small" variant="outlined">
            Next
          </Button>
        </Stack>
      </Box>

      {/* Update Modal */}
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
