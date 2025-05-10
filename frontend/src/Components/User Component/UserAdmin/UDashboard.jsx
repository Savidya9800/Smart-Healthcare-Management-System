import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UAdminLayout from "./UAdminLayout";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CalendarToday as CalendarTodayIcon,
  LocalHospital as LocalHospitalIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { IconButton } from "@mui/material";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

function UDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    appointmentsToday: 0,
    criticalCases: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    // Simulating API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your backend API
        // For demo purposes, we're using setTimeout to simulate a network request
        setTimeout(() => {
          setStats({
            totalPatients: 1245,
            newPatients: 48,
            appointmentsToday: 32,
            criticalCases: 7,
          });

          setRecentPatients([
            {
              id: 1,
              name: "John Doe",
              age: 45,
              gender: "Male",
              condition: "Diabetes",
              status: "Stable",
              lastVisit: "2025-05-08T08:30:00",
              bloodGroup: "O+",
            },
            {
              id: 2,
              name: "Sarah Johnson",
              age: 38,
              gender: "Female",
              condition: "Hypertension",
              status: "Under Observation",
              lastVisit: "2025-05-09T10:15:00",
              bloodGroup: "A-",
            },
            {
              id: 3,
              name: "Michael Brown",
              age: 62,
              gender: "Male",
              condition: "Cardiac Issue",
              status: "Critical",
              lastVisit: "2025-05-09T14:45:00",
              bloodGroup: "B+",
            },
            {
              id: 4,
              name: "Emily Wilson",
              age: 29,
              gender: "Female",
              condition: "Pregnancy",
              status: "Stable",
              lastVisit: "2025-05-08T11:30:00",
              bloodGroup: "AB+",
            },
            {
              id: 5,
              name: "James Garcia",
              age: 52,
              gender: "Male",
              condition: "Post-Surgery",
              status: "Recovering",
              lastVisit: "2025-05-07T09:00:00",
              bloodGroup: "O-",
            },
          ]);

          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const patientRegistrationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "New Registrations",
        data: [65, 78, 52, 91, 43, 56, 61, 87, 45, 53, 42, 48],
        fill: true,
        backgroundColor: "rgba(230, 49, 125, 0.2)",
        borderColor: "#e6317d",
        tension: 0.4,
      },
    ],
  };

  const genderDistributionData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [42, 56, 2],
        backgroundColor: ["#2b2c6c", "#e6317d", "#2fb297"],
        borderWidth: 0,
      },
    ],
  };

  const ageGroupData = {
    labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    datasets: [
      {
        label: "Patients by Age Group",
        data: [125, 235, 380, 310, 195],
        backgroundColor: "#2fb297",
        borderRadius: 5,
      },
    ],
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "#f44336"; // Red
      case "under observation":
        return "#ff9800"; // Orange
      case "recovering":
        return "#2196f3"; // Blue
      case "stable":
        return "#4caf50"; // Green
      default:
        return "#757575"; // Grey
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <UAdminLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress sx={{ color: "#e6317d" }} />
        </Box>
      </UAdminLayout>
    );
  }

  return (
    <UAdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "500", color: "#2b2c6c" }}>
          User Administration Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#71717d" }}>
          Welcome back! Here's an overview of your patient management system.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                height: "100%",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      Total Patients
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#2b2c6c" }}>
                      {stats.totalPatients.toLocaleString()}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#2b2c6c20", color: "#2b2c6c", width: 56, height: 56 }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <span style={{ color: "#4caf50", fontWeight: 500 }}>↑ 12%</span> from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                height: "100%",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      New Patients (This Month)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#e6317d" }}>
                      {stats.newPatients}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#e6317d20", color: "#e6317d", width: 56, height: 56 }}>
                    <PersonAddIcon />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <span style={{ color: "#4caf50", fontWeight: 500 }}>↑ 8%</span> from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                height: "100%",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      Appointments Today
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#2fb297" }}>
                      {stats.appointmentsToday}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#2fb29720", color: "#2fb297", width: 56, height: 56 }}>
                    <CalendarTodayIcon />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <span style={{ color: "#ff9800", fontWeight: 500 }}>↓ 3%</span> from yesterday
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                height: "100%",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" }
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                      Critical Cases
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#f44336" }}>
                      {stats.criticalCases}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#f4433620", color: "#f44336", width: 56, height: 56 }}>
                    <LocalHospitalIcon />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <span style={{ color: "#4caf50", fontWeight: 500 }}>↓ 2</span> from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "#2b2c6c" }}>
                  Patient Registration Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monthly registration data for the current year
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={patientRegistrationData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "#2b2c6c" }}>
                  Gender Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Patient demographics by gender
                </Typography>
                <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                  <Doughnut
                    data={genderDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                      cutout: "60%",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "#2b2c6c" }}>
                    Recent Patients
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ 
                      color: "#e6317d", 
                      borderColor: "#e6317d",
                      '&:hover': {
                        borderColor: "#e6317d",
                        backgroundColor: "#e6317d10"
                      }
                    }}
                    onClick={() => navigate("/User-Management")}
                  >
                    View All
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table sx={{ minWidth: 650 }} size="medium">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                        <TableCell>Patient Name</TableCell>
                        <TableCell align="right">Age</TableCell>
                        <TableCell align="right">Blood Group</TableCell>
                        <TableCell align="right">Condition</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Last Visit</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentPatients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:hover": { backgroundColor: "#f9f9f9" },
                          }}
                        >
                          <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                            {patient.name}
                          </TableCell>
                          <TableCell align="right">{patient.age}</TableCell>
                          <TableCell align="right">{patient.bloodGroup}</TableCell>
                          <TableCell align="right">{patient.condition}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={patient.status}
                              size="small"
                              sx={{
                                backgroundColor: `${getStatusColor(patient.status)}20`,
                                color: getStatusColor(patient.status),
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">{formatDate(patient.lastVisit)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              sx={{ color: "#2b2c6c" }}
                              onClick={() => navigate(`/patient/${patient.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "#2b2c6c" }}>
                  Patients by Age Group
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Distribution of patients by age ranges
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={ageGroupData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </UAdminLayout>
  );
}

export default UDashboard;
