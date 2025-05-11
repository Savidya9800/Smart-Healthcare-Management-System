import React, { useState, useEffect } from "react";
import axios from "axios";
import DAdminLayout from "./DAdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as LocalHospitalIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  EventBusy as EventBusyIcon,
  TrendingUp as TrendingUpIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  LocalPharmacy as LocalPharmacyIcon,
  MedicalServices as MedicalServicesIcon,
  People as PeopleIcon,
  Sick as SickIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Define colors for consistency
const colors = {
  darkGray: "#71717D",
  gray: "#828487",
  pink: "#E6317D",
  white: "#FFFFFF",
  blue: "#2B2C6C",
  green: "#2FB297",
  yellow: "#f4b400",
  purple: "#673AB7",
  lightGray: "#f5f5f5",
};

const APPOINTMENTS_API = "http://localhost:5000/api/appoinment";
const PRESCRIPTIONS_API = "http://localhost:5000/api/prescription/";
const LEAVES_API = "http://localhost:5000/api/doctor-leaves";

const DDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState({});
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    prescriptions: 0,
    pendingLeaves: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get doctor profile data (mock data for this example)
      const doctorProfile = {
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        hospital: "City General Hospital",
        experience: "8 years",
        rating: 4.7,
        patients: 1245,
        photo: "/doctor-avatar.jpg"
      };
      setDoctorData(doctorProfile);

      // Get doctor's appointments
      const appointmentsResponse = await axios.get(`${APPOINTMENTS_API}?doctorId=doctor123`);
      const appointments = appointmentsResponse.data.appoinments || [];

      // Get doctor's prescriptions
      const prescriptionsResponse = await axios.get(`${PRESCRIPTIONS_API}`);
      const prescriptions = prescriptionsResponse.data || [];
      console.log("Prescriptions:", prescriptions);

      // Get doctor's leave requests
      const leavesResponse = await axios.get(`${LEAVES_API}?doctorId=doctor123`);
      const leaves = leavesResponse.data || [];

      // Calculate statistics
      const pendingAppointments = appointments.filter(a => a.status === "Pending").length;
      const completedAppointments = appointments.filter(a => a.status === "Completed").length;
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date).toISOString().split('T')[0];
        return appointmentDate === today;
      });

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        pendingAppointments,
        completedAppointments,
        prescriptions: prescriptions.length,
        pendingLeaves: leaves.filter(l => l.status === "Pending").length,
      });

      // Get upcoming appointments (next 5 days)
      const now = new Date();
      const fiveDaysLater = new Date(now);
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

      const upcoming = appointments
        .filter(a => {
          const apptDate = new Date(a.date);
          return apptDate >= now && apptDate <= fiveDaysLater && a.status !== "Completed";
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setUpcomingAppointments(upcoming);

      // Get recent prescriptions
      const recentPrescriptions = prescriptions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentPrescriptions(recentPrescriptions);

      // Calculate appointment types distribution
      const typeData = {};
      appointments.forEach(appointment => {
        const type = appointment.type || "General Checkup";
        typeData[type] = (typeData[type] || 0) + 1;
      });

      const typeArray = Object.keys(typeData).map(key => ({
        name: key,
        value: typeData[key],
      }));

      setAppointmentTypes(typeArray);

      // Calculate weekly appointments
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const weekData = dayNames.map(day => ({
        name: day,
        appointments: 0,
      }));

      appointments.forEach(appointment => {
        if (appointment.date) {
          const dayOfWeek = new Date(appointment.date).getDay();
          weekData[dayOfWeek].appointments += 1;
        }
      });

      setWeeklyAppointments(weekData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setSnackbar({
        open: true,
        message: `Failed to load dashboard data: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedDoctor = sessionStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchDashboardData();
    setSnackbar({
      open: true,
      message: "Dashboard data refreshed",
      severity: "info",
    });
  };

  const filteredUpcoming = upcomingAppointments.filter(
    (appointment) =>
      appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptions = recentPrescriptions.filter(
    (prescription) =>
      prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Color array for charts
  const CHART_COLORS = [colors.pink, colors.blue, colors.green, colors.yellow, colors.purple];

  return (
    <DAdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: colors.blue, 
            borderBottom: `3px solid ${colors.pink}`, 
            display: "inline-block", 
            pb: 1,
          }}>
            Doctor Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ color: colors.blue, borderColor: colors.blue }}
          >
            Refresh Data
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Doctor Profile and Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Doctor Profile Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  height: "100%",
                  border: `1px solid ${colors.lightGray}`,
                }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar 
                        src={doctorData.photo} 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mr: 3,
                          border: `3px solid ${colors.pink}` 
                        }}
                      />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.blue }}>
                          {doctorData.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {doctorData.specialization}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <LocalHospitalIcon fontSize="small" sx={{ color: colors.pink, mr: 1 }} />
                          <Typography variant="body2">{doctorData.hospital}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">Experience</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doctorData.experience}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">Rating</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doctorData.rating}/5
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">Patients</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doctorData.patients}+
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">Specialty</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doctorData.specialization}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: `1px solid ${colors.lightGray}`,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle1" color="text.secondary">Today's Appointments</Typography>
                          <Box sx={{ 
                            bgcolor: `${colors.green}20`, 
                            borderRadius: "50%", 
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <CalendarTodayIcon sx={{ color: colors.green }} />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.green }}>
                          {stats.todayAppointments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Scheduled for today
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: `1px solid ${colors.lightGray}`,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle1" color="text.secondary">Pending Appointments</Typography>
                          <Box sx={{ 
                            bgcolor: `${colors.yellow}20`, 
                            borderRadius: "50%", 
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <AccessTimeIcon sx={{ color: colors.yellow }} />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.yellow }}>
                          {stats.pendingAppointments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Awaiting your review
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: `1px solid ${colors.lightGray}`,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle1" color="text.secondary">Prescriptions</Typography>
                          <Box sx={{ 
                            bgcolor: `${colors.purple}20`, 
                            borderRadius: "50%", 
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <LocalPharmacyIcon sx={{ color: colors.purple }} />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.purple }}>
                          {stats.prescriptions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Issued this month
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Card sx={{ 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: `1px solid ${colors.lightGray}`,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle1" color="text.secondary">Total Appointments</Typography>
                          <Box sx={{ 
                            bgcolor: `${colors.blue}20`, 
                            borderRadius: "50%", 
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <EventIcon sx={{ color: colors.blue }} />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.blue }}>
                          {stats.totalAppointments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          All appointments
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Card sx={{ 
                      borderRadius: "16px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      border: `1px solid ${colors.lightGray}`,
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="subtitle1" color="text.secondary">Pending Leaves</Typography>
                          <Box sx={{ 
                            bgcolor: `${colors.pink}20`, 
                            borderRadius: "50%", 
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <WorkIcon sx={{ color: colors.pink }} />
                          </Box>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.pink }}>
                          {stats.pendingLeaves}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Leave requests pending
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.blue }}>
                      Weekly Appointment Distribution
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {weeklyAppointments.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={weeklyAppointments}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="appointments" fill={colors.blue} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                          <Typography color="text.secondary">No weekly data available</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.blue }}>
                      Appointment Types
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {appointmentTypes.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={appointmentTypes}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {appointmentTypes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                          <Typography color="text.secondary">No appointment type data available</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* Upcoming Appointments */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  height: "100%",
                }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.blue }}>
                        Upcoming Appointments
                      </Typography>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate("/Doctor-Dashboard/View-Appointment")}
                        sx={{ color: colors.pink }}
                      >
                        View All
                      </Button>
                    </Box>

                    <TextField
                      placeholder="Search appointments..."
                      size="small"
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Divider sx={{ mb: 2 }} />

                    {filteredUpcoming.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Patient</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Date & Time</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredUpcoming.map((appointment) => (
                              <TableRow key={appointment._id} hover>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon fontSize="small" sx={{ color: colors.gray, mr: 1 }} />
                                    {appointment.name || "N/A"}
                                  </Box>
                                </TableCell>
                                <TableCell>{appointment.type || "General Checkup"}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <EventIcon fontSize="small" sx={{ color: colors.gray, width: 16, height: 16 }} />
                                      <Typography variant="body2">
                                        {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <AccessTimeIcon fontSize="small" sx={{ color: colors.gray, width: 16, height: 16 }} />
                                      <Typography variant="body2">{appointment.time || "N/A"}</Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    label={appointment.status}
                                    sx={{
                                      bgcolor: appointment.status === "Completed" ? `${colors.green}20` : 
                                              appointment.status === "Reviewed" ? `${colors.yellow}20` :
                                              appointment.status === "Pending" ? `${colors.yellow}20` :
                                              `${colors.gray}20`,
                                      color: appointment.status === "Completed" ? colors.green :
                                             appointment.status === "Reviewed" ? colors.yellow :
                                             appointment.status === "Pending" ? colors.yellow :
                                             colors.gray,
                                      fontWeight: 500
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center'
                      }}>
                        <EventIcon sx={{ fontSize: 40, color: colors.gray, mb: 2 }} />
                        <Typography variant="body1" sx={{ color: colors.darkGray, mb: 1 }}>
                          {searchTerm ? "No matching appointments found" : "No upcoming appointments"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ? "Try a different search term" : "Your upcoming appointments will appear here"}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Prescriptions */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  height: "100%",
                }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.blue }}>
                        Recent Prescriptions
                      </Typography>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate("/doctor-prescription-management")}
                        sx={{ color: colors.pink }}
                      >
                        View All
                      </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {filteredPrescriptions.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Patient</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Medication</TableCell>
                              <TableCell>Dosage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredPrescriptions.map((prescription) => (
                              <TableRow key={prescription._id} hover>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SickIcon fontSize="small" sx={{ color: colors.gray, mr: 1 }} />
                                    {prescription.patientName || "N/A"}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  {prescription.date ? new Date(prescription.date).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {prescription.medication || "N/A"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {prescription.dosage || "N/A"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center'
                      }}>
                        <LocalPharmacyIcon sx={{ fontSize: 40, color: colors.gray, mb: 2 }} />
                        <Typography variant="body1" sx={{ color: colors.darkGray, mb: 1 }}>
                          {searchTerm ? "No matching prescriptions found" : "No recent prescriptions"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ? "Try a different search term" : "Your recent prescriptions will appear here"}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mt: 3,
                  backgroundImage: `linear-gradient(to right, ${colors.blue}, ${colors.pink})`,
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.white }}>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/Doctor-Dashboard/View-Appointment")}
                        startIcon={<EventIcon />}
                        sx={{ 
                          bgcolor: colors.white, 
                          color: colors.blue,
                          "&:hover": { bgcolor: colors.lightGray }
                        }}
                      >
                        Manage Appointments
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/doctor-prescription-management")}
                        startIcon={<LocalPharmacyIcon />}
                        sx={{ 
                          bgcolor: colors.white, 
                          color: colors.pink,
                          "&:hover": { bgcolor: colors.lightGray }
                        }}
                      >
                        Manage Prescriptions
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/doctor-leave-management")}
                        startIcon={<WorkIcon />}
                        sx={{ 
                          bgcolor: colors.white, 
                          color: colors.purple,
                          "&:hover": { bgcolor: colors.lightGray }
                        }}
                      >
                        Manage Leaves
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/doctor-profile")}
                        startIcon={<PersonIcon />}
                        sx={{ 
                          bgcolor: colors.white, 
                          color: colors.green,
                          "&:hover": { bgcolor: colors.lightGray }
                        }}
                      >
                        Update Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
              borderRadius: "10px",
              bgcolor:
                snackbar.severity === "success" ? colors.green :
                snackbar.severity === "info" ? colors.blue :
                snackbar.severity === "warning" ? colors.yellow :
                colors.pink,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DAdminLayout>
  );
};

export default DDashboard;