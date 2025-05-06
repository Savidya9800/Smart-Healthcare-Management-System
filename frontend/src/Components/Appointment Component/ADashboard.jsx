import React, { useState, useEffect } from "react";
import axios from "axios";
import AAdminLayout from "./AAdminLayout";
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
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Define colors for consistency with your existing components
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
const REJECTED_API = "http://localhost:5000/api/rejected-appointments";

const ADashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    completed: 0,
    rejected: 0,
    todayCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRejections, setRecentRejections] = useState([]);
  const [specializationStats, setSpecializationStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get all regular appointments
      const appointmentsResponse = await axios.get(APPOINTMENTS_API);
      const appointments = appointmentsResponse.data.appoinments || [];

      // Get all rejected appointments
      const rejectedResponse = await axios.get(REJECTED_API);
      const rejectedAppointments = rejectedResponse.data || [];

      // Calculate statistics
      const pending = appointments.filter(a => a.status === "Pending").length;
      const reviewed = appointments.filter(a => a.status === "Reviewed").length;
      const completed = appointments.filter(a => a.status === "Completed").length;
      const rejected = rejectedAppointments.length;
      const total = appointments.length + rejectedAppointments.length;

      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date).toISOString().split('T')[0];
        return appointmentDate === today;
      });

      setStats({
        total,
        pending,
        reviewed,
        completed,
        rejected,
        todayCount: todayAppointments.length,
      });

      // Get upcoming appointments (next 5 days)
      const now = new Date();
      const fiveDaysLater = new Date(now);
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

      const upcoming = appointments
        .filter(a => {
          const apptDate = new Date(a.date);
          return apptDate >= now && apptDate <= fiveDaysLater;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setUpcomingAppointments(upcoming);

      // Get recent rejections
      const recent = rejectedAppointments
        .sort((a, b) => new Date(b.rejectedAt || 0) - new Date(a.rejectedAt || 0))
        .slice(0, 5);

      setRecentRejections(recent);

      // Calculate specialization distribution
      const specializationData = {};
      appointments.forEach(appointment => {
        const specialization = appointment.specialization || "Unknown";
        specializationData[specialization] = (specializationData[specialization] || 0) + 1;
      });

      const specializationArray = Object.keys(specializationData).map(key => ({
        name: key,
        value: specializationData[key],
      }));

      setSpecializationStats(specializationArray);

      // Calculate weekly statistics
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

      setWeeklyStats(weekData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setSnackbar({
        open: true,
        message: `Failed to load dashboard data: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
      setLoading(false);
    }
  };

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
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejections = recentRejections.filter(
    (rejection) =>
      rejection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rejection.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rejection.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rejection.rejectionReason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Color array for pie chart
  const CHART_COLORS = [colors.pink, colors.blue, colors.green, colors.yellow, colors.purple];

  return (
    <AAdminLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: colors.blue, 
            borderBottom: `3px solid ${colors.pink}`, 
            display: "inline-block", 
            pb: 1,
          }}>
            Appointment Dashboard
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
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
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
                        <DashboardIcon sx={{ color: colors.blue }} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.blue }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      All appointment records
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                      {stats.todayCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Scheduled for today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                      <Typography variant="subtitle1" color="text.secondary">Pending/Reviewed</Typography>
                      <Box sx={{ 
                        bgcolor: `${colors.yellow}20`, 
                        borderRadius: "50%", 
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <CheckCircleIcon sx={{ color: colors.yellow }} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.yellow }}>
                      {stats.pending + stats.reviewed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {(stats.total > 0 ? Math.round(((stats.pending + stats.reviewed) / stats.total) * 100) : 0)}% of total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                      <Typography variant="subtitle1" color="text.secondary">Rejected</Typography>
                      <Box sx={{ 
                        bgcolor: `${colors.pink}20`, 
                        borderRadius: "50%", 
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <CancelIcon sx={{ color: colors.pink }} />
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 600, mt: 2, color: colors.pink }}>
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {(stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0)}% of total
                    </Typography>
                  </CardContent>
                </Card>
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
                      {weeklyStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={weeklyStats}
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
                      Appointments by Specialization
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {specializationStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={specializationStats}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {specializationStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                          <Typography color="text.secondary">No specialization data available</Typography>
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
                        onClick={() => navigate("/Appoinment-Management")}
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
                              <TableCell>Doctor</TableCell>
                              <TableCell>Date & Time</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredUpcoming.map((appointment) => (
                              <TableRow key={appointment._id} hover>
                                <TableCell>{appointment.name || "N/A"}</TableCell>
                                <TableCell>{appointment.doctorName || "N/A"}</TableCell>
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

              {/* Recent Rejected Appointments */}
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  height: "100%",
                }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.blue }}>
                        Recent Rejected Appointments
                      </Typography>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate("/Rijected-Appoinment")}
                        sx={{ color: colors.pink }}
                      >
                        View All
                      </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {filteredRejections.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Patient</TableCell>
                              <TableCell>Doctor</TableCell>
                              <TableCell>Rejected On</TableCell>
                              <TableCell>Reason</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredRejections.map((rejection) => (
                              <TableRow key={rejection._id} hover>
                                <TableCell>{rejection.name || "N/A"}</TableCell>
                                <TableCell>{rejection.doctorName || "N/A"}</TableCell>
                                <TableCell>
                                  {rejection.rejectedAt ? new Date(rejection.rejectedAt).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    {rejection.rejectionReason || "No reason provided"}
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
                        <EventBusyIcon sx={{ fontSize: 40, color: colors.gray, mb: 2 }} />
                        <Typography variant="body1" sx={{ color: colors.darkGray, mb: 1 }}>
                          {searchTerm ? "No matching rejections found" : "No rejected appointments"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm ? "Try a different search term" : "Recent rejected appointments will appear here"}
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
                        onClick={() => navigate("/Appoinment-Management")}
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
                        onClick={() => navigate("/Rijected-Appoinment")}
                        startIcon={<EventBusyIcon />}
                        sx={{ 
                          bgcolor: colors.white, 
                          color: colors.pink,
                          "&:hover": { bgcolor: colors.lightGray }
                        }}
                      >
                        View Rejected
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
    </AAdminLayout>
  );
};

export default ADashboard;