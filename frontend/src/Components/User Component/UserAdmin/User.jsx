import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableRow,
  TableCell,
  Typography,
  Table,
  TableHead,
  TableBody,
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import UpdateUser from "./UpdateUser"; // Import the modal component

function User({ row }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  return (
    <>
      <TableRow sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: "600", color: "#333" }}>{row.name}</TableCell>
        <TableCell align="right">{row.email}</TableCell>
        <TableCell align="right">{row.mobile}</TableCell>
        <TableCell align="right">{new Date(row.regDate).toLocaleDateString()}</TableCell>
        <TableCell align="right">{row.bloodGroup}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#E6317D",
              "&:hover": { backgroundColor: "#C02568" },
              textTransform: "none",
            }}
            onClick={() => setModalOpen(true)} // Open modal on click
          >
            Update
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
              <Typography variant="h6" gutterBottom>
                More Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Gender
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Date of Birth
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">{new Date(row.dateOfBirth).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Update Modal */}
      {isModalOpen && <UpdateUser user={row} onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default User;
