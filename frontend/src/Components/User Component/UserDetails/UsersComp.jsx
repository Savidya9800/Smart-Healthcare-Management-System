import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

function createData(name, email, mobile, date, bloodGroup) {
  return {
    name,
    email,
    mobile,
    date,
    bloodGroup,
    history: [
      {
        country: "USA",
        city: "New York",
        gender: "Male",
        dob: "1990-05-14",
      },
      {
        country: "UK",
        city: "London",
        gender: "Female",
        dob: "1988-09-23",
      },
    ],
  };
}

function Row({ row }) {
  const [open, setOpen] = React.useState(false);

  const handleUpdate = (rowData) => {
    console.log("Updating:", rowData);
    alert(`Update User: ${rowData.name}`);
  };

  return (
    <>
      <TableRow sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: "600", color: "#333" }}>
          {row.name}
        </TableCell>
        <TableCell align="right">{row.email}</TableCell>
        <TableCell align="right">{row.mobile}</TableCell>
        <TableCell align="right">{row.date}</TableCell>
        <TableCell align="right">{row.bloodGroup}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#E6317D",
              "&:hover": { backgroundColor: "#C02568" },
              textTransform: "none",
            }}
            onClick={() => handleUpdate(row)}
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
                  {row.history.map((historyRow, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
                    >
                      <TableCell>{historyRow.country}</TableCell>
                      <TableCell>{historyRow.city}</TableCell>
                      <TableCell align="right">{historyRow.gender}</TableCell>
                      <TableCell align="right">{historyRow.dob}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    bloodGroup: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        country: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        dob: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "John Doe",
    "john@example.com",
    "123-456-7890",
    "2022-01-15",
    "O+"
  ),
  createData(
    "Jane Smith",
    "jane@example.com",
    "987-654-3210",
    "2021-12-10",
    "A-"
  ),
  createData(
    "Michael Brown",
    "michael@example.com",
    "555-123-6789",
    "2020-05-20",
    "B+"
  ),
  createData(
    "Sarah White",
    "sarah@example.com",
    "444-987-6543",
    "2019-11-30",
    "AB-"
  ),
  createData(
    "David Green",
    "david@example.com",
    "222-555-9999",
    "2023-06-05",
    "O-"
  ),
];

export default function UsersComp() {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "12px", boxShadow: 3 }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#2FB297" }}>
            <TableCell />
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
            >
              Patient Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
              align="right"
            >
              Email
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
              align="right"
            >
              Mobile Number
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
              align="right"
            >
              Registered Date
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
              align="right"
            >
              Blood Group
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: "1.1rem",
                py: 1.5,
              }}
              align="right"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
