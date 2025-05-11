import React, { useState, useEffect } from "react";
import PAdminLayout from "./PAdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Warning,
  Inventory,
  MedicalServices,
  Receipt,
  Timeline,
  LocalShipping,
  NotificationsActive,
  ArrowForward,
  Add,
} from "@mui/icons-material";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

function PDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    expiringItems: 0,
    categories: 0,
  });
  const [recentStock, setRecentStock] = useState([]);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls:
        // const response = await axios.get("http://localhost:5000/api/pharmacy/dashboard-stats");

        // Simulated data
        setTimeout(() => {
          setStats({
            totalItems: 247,
            lowStockItems: 12,
            expiringItems: 8,
            categories: 18,
          });

          setRecentStock([
            {
              _id: "1",
              name: "Amoxicillin 500mg",
              type: "Tablet",
              quantity: 320,
              expiryDate: "2025-06-15",
              status: "Good",
            },
            {
              _id: "2",
              name: "Paracetamol 650mg",
              type: "Tablet",
              quantity: 155,
              expiryDate: "2025-03-22",
              status: "Medium",
            },
            {
              _id: "3",
              name: "Cetirizine 10mg",
              type: "Tablet",
              quantity: 8,
              expiryDate: "2025-01-10",
              status: "Low",
            },
            {
              _id: "4",
              name: "Metformin 850mg",
              type: "Tablet",
              quantity: 43,
              expiryDate: "2024-12-05",
              status: "Expiring Soon",
            },
            {
              _id: "5",
              name: "Azithromycin 250mg",
              type: "Capsule",
              quantity: 82,
              expiryDate: "2025-08-30",
              status: "Good",
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [3200, 2800, 3500, 4200, 3800, 4500],
        fill: true,
        backgroundColor: "rgba(43, 44, 108, 0.2)",
        borderColor: "#2b2c6c",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: [
      "Antibiotics",
      "Analgesics",
      "Antihistamines",
      "Antidiabetics",
      "Others",
    ],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          "#2b2c6c",
          "#2fb297",
          "#e6317d",
          "#FFB347",
          "#86C5DA",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topSellingData = {
    labels: [
      "Paracetamol",
      "Amoxicillin",
      "Cetirizine",
      "Metformin",
      "Azithromycin",
    ],
    datasets: [
      {
        label: "Units Sold",
        data: [420, 325, 280, 240, 195],
        backgroundColor: "#2fb297",
        borderRadius: 5,
      },
    ],
  };

  // Get stock level color
  const getStockLevelColor = (status) => {
    switch (status) {
      case "Low":
        return "error";
      case "Medium":
        return "warning";
      case "Expiring Soon":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <PAdminLayout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#2b2c6c" }}
          >
            Pharmacy Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/Stock-Adding")}
            sx={{
              bgcolor: "#2fb297",
              "&:hover": { bgcolor: "#259a82" },
            }}
          >
            Add New Stock
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                background: "linear-gradient(45deg, #2b2c6c 30%, #3f3f8f 90%)",
                color: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Total Medicines
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      in inventory
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      height: 56,
                      width: 56,
                    }}
                  >
                    <MedicalServices sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                background: "linear-gradient(45deg, #e6317d 30%, #ec5598 90%)",
                color: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Low Stock
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                      {stats.lowStockItems}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      need reordering
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      height: 56,
                      width: 56,
                    }}
                  >
                    <Warning sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                background: "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)",
                color: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Expiring Soon
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                      {stats.expiringItems}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      within 30 days
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      height: 56,
                      width: 56,
                    }}
                  >
                    <Timeline sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 2,
                background: "linear-gradient(45deg, #2fb297 30%, #42c7ad 90%)",
                color: "white",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                      Categories
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", my: 1 }}>
                      {stats.categories}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      medicine types
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      height: 56,
                      width: 56,
                    }}
                  >
                    <Inventory sx={{ fontSize: 30 }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analytics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2, color: "#2b2c6c" }}
              >
                Sales Trends
              </Typography>
              <Box sx={{ height: 250 }}>
                <Line
                  data={salesData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2, color: "#2b2c6c" }}
              >
                Stock Distribution
              </Typography>
              <Box
                sx={{ height: 250, display: "flex", justifyContent: "center" }}
              >
                <Doughnut
                  data={categoryData}
                  options={{
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#2b2c6c" }}
                >
                  Current Inventory Overview
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/Stock")}
                  sx={{ color: "#2fb297" }}
                >
                  View All
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Medicine Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Quantity
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Expiry Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentStock.map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            color={getStockLevelColor(item.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2, color: "#2b2c6c" }}
              >
                Top Selling Medicines
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={topSellingData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1, color: "#2b2c6c" }}
                >
                  Quick Actions
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/Stock-Adding")}
                      sx={{
                        borderColor: "#2b2c6c",
                        color: "#2b2c6c",
                        "&:hover": {
                          borderColor: "#1e1f4b",
                          bgcolor: "rgba(43, 44, 108, 0.04)",
                        },
                      }}
                    >
                      Add Stock
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/Pharmacy-Stocks")}
                      sx={{
                        borderColor: "#2fb297",
                        color: "#2fb297",
                        "&:hover": {
                          borderColor: "#259a82",
                          bgcolor: "rgba(47, 178, 151, 0.04)",
                        },
                      }}
                    >
                      View Inventory
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PAdminLayout>
  );
}

export default PDashboard;
