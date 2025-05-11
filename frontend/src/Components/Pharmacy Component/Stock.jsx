import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StockDetails from "./StockDetails";
import UpdateStock from "./UpdateStock";
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
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Grid,
  Tooltip,
  Pagination,
  Menu,
  MenuItem,
  Fade,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  DeleteOutline,
  Edit,
  Add as AddIcon,
  SortByAlpha as SortIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";

function Stock() {
  const navigate = useNavigate();
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("name-asc");

  // Fetch stock data
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/stock");
      setStockData(response.data);
      setFilteredData(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching stock data:", err.message);
      setError("Failed to fetch stock data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    if (searchQuery) {
      const filtered = stockData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(stockData);
    }
    setPage(1);
  }, [searchQuery, stockData]);

  // Handle sorting
  useEffect(() => {
    const [field, direction] = sortOrder.split("-");
    const sorted = [...filteredData].sort((a, b) => {
      if (field === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (field === "quantity") {
        return direction === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }
      return 0;
    });

    setFilteredData(sorted);
  }, [sortOrder]);

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    handleSortMenuClose();
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/stock/${id}`);
      setStockData(stockData.filter((item) => item._id !== id));
      setIsDeleteConfirmOpen(false);
      setStockToDelete(null);
    } catch (err) {
      console.error("Error deleting stock item:", err.message);
      setError("Failed to delete stock item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdateClick = (stockItem) => {
    setSelectedStock(stockItem);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async (updatedStock) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/stock/${updatedStock._id}`,
        updatedStock
      );
      setStockData(
        stockData.map((item) =>
          item._id === updatedStock._id ? response.data : item
        )
      );
      setIsUpdateModalOpen(false);
      setSelectedStock(null);
    } catch (err) {
      console.error("Error updating stock:", err.message);
      setError("Failed to update stock item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to StockAdding page
  const handleAddNewItem = () => {
    navigate("/Stock-Adding");
  };

  // Generate and download PDF - Enhanced professional version
  const generatePDF = (item) => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Medicine-${item.name.replace(/\s+/g, "-")}`,
      subject: "Medicine Inventory Details",
      author: "MediFlow Healthcare System",
      keywords: "medicine, inventory, pharmacy, healthcare",
      creator: "MediFlow",
    });

    // Add watermark
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
        doc.setGState(new doc.GState({ opacity: 0.2 }));

        // Add watermark with angle parameter
        doc.text("MEDIFLOW", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: -45,
        });
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

    // Add header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("MEDIFLOW", 15, 18);

    // Add sub-header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(47, 178, 151); // #2fb297 - Green color for emphasis
    doc.text("HEALTHCARE MANAGEMENT SYSTEM", 15, 26);

    // Add contact details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Medical Center Drive, Healthcare City", 15, 32);
    doc.text("Phone: (123) 456-7890 | Email: pharmacy@mediflow.com", 15, 36);
    doc.text("www.mediflow.com", 15, 40);

    // Add date in header (moved to right side)
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 135, 36, { align: "right" });

    // Add header line separator (moved down slightly)
    doc.setDrawColor(230, 230, 230);
    doc.line(15, 44, 185, 44);

    // Add medicine details box - IMPROVED VERSION
    doc.setFillColor(245, 250, 250); // Light background for better visibility
    doc.setDrawColor(47, 178, 151); // Green border
    doc.roundedRect(140, 10, 60, 30, 3, 3, "FD"); // Filled rectangle with rounded corners

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(43, 44, 108); // #2b2c6c - Dark blue for main title
    doc.text("INVENTORY ITEM", 170, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60); // Darker text for better readability
    doc.text(`ID: ${item._id?.substring(0, 8) || "N/A"}`, 170, 28, {
      align: "center",
    });

    // Add contrasting background for stock status
    const stockStatus =
      item.quantity <= 10
        ? "LOW STOCK"
        : item.quantity <= 30
        ? "MEDIUM STOCK"
        : "GOOD STOCK";
    const statusColor =
      item.quantity <= 10
        ? [230, 49, 125] // Red for low
        : item.quantity <= 30
        ? [255, 153, 0] // Orange for medium
        : [47, 178, 151]; // Green for good

    // Add mini-box for stock status
    const statusWidth = 40;
    const statusX = 170 - statusWidth / 2;
    doc.setFillColor(...statusColor, 0.15); // Semi-transparent background matching status
    doc.setDrawColor(...statusColor);
    doc.roundedRect(statusX, 31, statusWidth, 8, 2, 2, "FD");

    doc.setTextColor(...statusColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(stockStatus, 170, 36, { align: "center" });

    // Add a divider below the header
    doc.setDrawColor(230, 230, 230); // Light gray
    doc.line(10, 50, 200, 50);

    // --- MAIN CONTENT SECTION ---

    // Product name and category
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(item.name, 10, 65);

    if (item.category) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`Category: ${item.category}`, 10, 72);
    }

    // --- BASIC INFO SECTION ---
    doc.setFillColor(240, 240, 250);
    doc.setDrawColor(220, 220, 240);
    doc.roundedRect(10, 80, 90, 70, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PRODUCT INFORMATION", 15, 90);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const displayInfo = [
      { label: "Type:", value: item.type || "N/A" },
      { label: "Manufacturer:", value: item.company || "N/A" },
      { label: "Batch Number:", value: item.batchNo || "N/A" },
      { label: "Pack Size:", value: item.packSize || "N/A" },
    ];

    let yPos = 100;
    displayInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.text(info.label, 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(String(info.value), 50, yPos);
      yPos += 10;
    });

    // --- STOCK INFO SECTION ---
    doc.setFillColor(240, 250, 245);
    doc.setDrawColor(220, 240, 230);
    doc.roundedRect(105, 80, 90, 70, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("INVENTORY STATUS", 110, 90);

    // Quantity with visual indicator
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Current Quantity:", 110, 100);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...statusColor);
    doc.text(String(item.quantity), 110, 110);

    // Stock level bar
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(145, 105, 40, 8, 2, 2, "FD");

    // Fill level based on quantity (capped at 100 or some reasonable number)
    const fillPercentage = Math.min(item.quantity / 100, 1);
    doc.setFillColor(...statusColor);
    if (fillPercentage > 0) {
      doc.roundedRect(145, 105, 40 * fillPercentage, 8, 2, 2, "F");
    }

    // Other stock details
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const stockDetails = [
      { label: "Location:", value: item.location || "N/A" },
    ];

    yPos = 125;
    stockDetails.forEach((detail) => {
      doc.setFont("helvetica", "bold");
      doc.text(detail.label, 110, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(String(detail.value), 145, yPos);
      yPos += 10;
    });

    // --- NOTES SECTION ---
    if (item.notes) {
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(10, 160, 190, 40, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(43, 44, 108); // #2b2c6c
      doc.text("NOTES", 15, 170);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const splitNotes = doc.splitTextToSize(String(item.notes), 180);
      doc.text(splitNotes, 15, 180);
    }

    // --- FOOTER SECTION ---

    // Create bottom border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(
      0,
      doc.internal.pageSize.height - 20,
      doc.internal.pageSize.width,
      2,
      "F"
    );

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Left side - inventory notice
      doc.text(
        "Inventory management document - Internal use only",
        10,
        doc.internal.pageSize.height - 12
      );

      // Center - website
      doc.text(
        "www.mediflow.com",
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.height - 12,
        {
          align: "center",
        }
      );

      // Right - page number and generation date
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 10,
        doc.internal.pageSize.height - 12,
        { align: "right" }
      );

      // Add color accent at bottom
      doc.setFillColor(47, 178, 151); // #2fb297
      doc.rect(
        0,
        doc.internal.pageSize.height - 5,
        doc.internal.pageSize.width,
        5,
        "F"
      );
    }

    // Add the watermark after all pages are created
    addWatermark(doc);

    // Save the PDF
    doc.save(`Medicine-${item.name.replace(/\s+/g, "-")}.pdf`);
  };

  // Calculate pagination
  const indexOfLastRecord = page * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Get stock level indicator
  const getStockLevelIndicator = (quantity) => {
    if (quantity <= 10) return { color: "error", label: "Low" };
    if (quantity <= 30) return { color: "warning", label: "Medium" };
    return { color: "success", label: "Good" };
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, color: "#2b2c6c", fontWeight: "bold" }}
      >
        Inventory Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ bgcolor: "#f8f9fe", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#2b2c6c", fontWeight: "medium" }}
              >
                Total Products
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mt: 2 }}>
                {loading ? <CircularProgress size={30} /> : stockData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ bgcolor: "#f8f9fe", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#2b2c6c", fontWeight: "medium" }}
              >
                Low Stock Items
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", mt: 2, color: "#e6317d" }}
              >
                {loading ? (
                  <CircularProgress size={30} />
                ) : (
                  stockData.filter((item) => item.quantity <= 10).length
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Card elevation={2} sx={{ bgcolor: "#f8f9fe", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#2b2c6c", fontWeight: "medium" }}
              >
                Categories
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", mt: 2, color: "#2fb297" }}
              >
                {loading ? (
                  <CircularProgress size={30} />
                ) : (
                  new Set(stockData.map((item) => item.category)).size
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSortMenuOpen}
            startIcon={<SortIcon />}
            sx={{
              borderColor: "#2b2c6c",
              color: "#2b2c6c",
              "&:hover": {
                borderColor: "#1e1f4b",
                bgcolor: "rgba(43, 44, 108, 0.04)",
              },
            }}
          >
            Sort
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortMenuClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => handleSortChange("name-asc")}>
              Name (A-Z)
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("name-desc")}>
              Name (Z-A)
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("quantity-asc")}>
              Quantity (Low to High)
            </MenuItem>
            <MenuItem onClick={() => handleSortChange("quantity-desc")}>
              Quantity (High to Low)
            </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            color="primary"
            onClick={fetchStockData}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "#2b2c6c",
              color: "#2b2c6c",
              "&:hover": {
                borderColor: "#1e1f4b",
                bgcolor: "rgba(43, 44, 108, 0.04)",
              },
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNewItem}
            sx={{
              bgcolor: "#2fb297",
              "&:hover": { bgcolor: "#259a82" },
            }}
          >
            Add New Item
          </Button>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stock Table */}
      <Paper elevation={2} sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
        {loading && <LinearProgress />}

        <TableContainer sx={{ maxHeight: 500 }}>
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
                  Medicine Name
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Company
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Batch No.
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Pack Size
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#2b2c6c",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Location
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
              {currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1">
                      No stock items found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.type || "N/A"}</TableCell>
                    <TableCell>{item.company || "N/A"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.batchNo || "N/A"}</TableCell>
                    <TableCell>{item.packSize || "N/A"}</TableCell>
                    <TableCell>{item.location || "N/A"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleUpdateClick(item)}
                            sx={{ color: "#2b2c6c" }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download PDF">
                          <IconButton
                            onClick={() => generatePDF(item)}
                            sx={{ color: "#2fb297" }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setStockToDelete(item._id);
                              setIsDeleteConfirmOpen(true);
                            }}
                            sx={{ color: "#e6317d" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
            size="large"
          />
        </Box>
      </Paper>

      {/* Update Modal */}
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
          Update Stock Item
        </DialogTitle>
        <DialogContent>
          {selectedStock && (
            <UpdateStock
              stock={selectedStock}
              onUpdateStock={handleUpdateStock}
              onCancel={() => setIsUpdateModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this stock item? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteConfirmOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(stockToDelete)}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && !filteredData.length}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default Stock;
