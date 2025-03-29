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
  InputAdornment,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={600} color="#1F295A">
          Registered Patients
        </Typography>
        <Box display="flex" alignItems="center">
          {/* Tailwind CSS Search Bar */}
          <div className="relative hidden mr-2 md:block">
            <div className="flex items-center px-4 py-2 border border-gray-100 rounded-lg bg-gray-50">
              <SearchIcon
                className="text-gray-400 "
                style={{ width: 18, height: 18 }}
              />
              <input
                type="text"
                placeholder="Search ..."
                className="w-48 ml-2 text-sm bg-transparent border-none outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="hidden ml-2 px-1.5 py-0.5 bg-gray-200 rounded text-xs text-gray-600 font-medium lg:flex items-center">
                ⌘K
              </div>
            </div>
          </div>

          {/* Filter Button */}
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
        </Box>
      </Box>

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
        sx={{ borderRadius: "12px", boxShadow: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2FB297" }}>
              <TableCell />
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
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
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
                <TableCell colSpan={7} align="center">
                  No matching users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
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