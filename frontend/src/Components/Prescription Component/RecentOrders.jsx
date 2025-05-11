import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import PrescriptionDetails from "./PrescriptionDetails";
import PAdminLayout from "../Pharmacy Component/PAdminLayout";

function RecentOrders() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch prescriptions data
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/prescriptions"
      );
      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter((prescription) =>
        prescription.medicine.some((med) =>
          med.medicineName.toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredPrescriptions(filtered);
    }
    setPage(1);
  }, [search, prescriptions]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle opening detailed view
  const handleViewDetails = async (prescriptionId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/prescriptions/${prescriptionId}`
      );
      setSelectedPrescription(response.data);
      setOpenDetails(true);
    } catch (err) {
      console.error("Error fetching prescription details:", err);
      setError("Failed to load prescription details.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastRecord = page * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredPrescriptions.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPrescriptions.length / rowsPerPage);

  return (
    <PAdminLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, color: "#2b2c6c", fontWeight: "bold" }}
        >
          Recent Prescription Orders
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by medicine name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={() => fetchPrescriptions()}
            sx={{
              bgcolor: "#2fb297",
              "&:hover": { bgcolor: "#259a82" },
            }}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    No.
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Doctor
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Date Issued
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Medicines
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#2b2c6c",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Loading prescriptions...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No prescriptions found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRecords.map((prescription, index) => (
                    <TableRow key={prescription._id} hover>
                      <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                      <TableCell>
                        {prescription.doctorId?.name || "Unknown"}
                        {prescription.doctorId?.specialization && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {prescription.doctorId.specialization}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(prescription.dateIssued)}
                      </TableCell>
                      <TableCell>
                        {prescription.medicine.slice(0, 2).map((med, idx) => (
                          <Typography key={idx} variant="body2">
                            {med.medicineName}
                          </Typography>
                        ))}
                        {prescription.medicine.length > 2 && (
                          <Chip
                            size="small"
                            label={`+${prescription.medicine.length - 2} more`}
                            sx={{ mt: 0.5, fontSize: "0.7rem" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={prescription.isVoided ? "Voided" : "Active"}
                          color={prescription.isVoided ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          size="small"
                          onClick={() => handleViewDetails(prescription._id)}
                          sx={{
                            bgcolor: "#e6317d",
                            "&:hover": { bgcolor: "#c62a6a" },
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Paper>

        {/* Prescription Details Dialog */}
        {selectedPrescription && (
          <Dialog
            open={openDetails}
            onClose={() => setOpenDetails(false)}
            maxWidth="md"
            fullWidth
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setOpenDetails(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <PrescriptionDetails prescription={selectedPrescription} />
          </Dialog>
        )}
      </Box>
    </PAdminLayout>
  );
}

export default RecentOrders;
