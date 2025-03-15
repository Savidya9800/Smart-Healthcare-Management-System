import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import User from "./User";
import UpdateUser from "./UpdateUser";

export default function UsersDetails() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update the user in the UI
  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 3, mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#2FB297" }}>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }}>
              Patient Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }} align="right">
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }} align="right">
              Mobile Number
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }} align="right">
              Registered Date
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }} align="right">
              Blood Group
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff", fontSize: "1.1rem", py: 1.5 }} align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <User key={user._id} row={user} onUpdate={() => setSelectedUser(user)} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">No users found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <UpdateUser 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onUpdate={handleUserUpdate} 
        />
      )}
    </TableContainer>
  );
}
