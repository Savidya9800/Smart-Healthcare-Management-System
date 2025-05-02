import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Flag as CountryIcon,
  Wc as GenderIcon,
  Opacity as BloodIcon,
  MedicalServices as MedicalIcon,
  Logout as LogoutIcon,
  DeleteForever as DeleteIcon,
} from "@mui/icons-material";
import UpdatePatientProfile from "./UpdatePatientProfile";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HistoryIcon from "@mui/icons-material/History";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Swal from "sweetalert2";

function PatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch user profile from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle updated user data after edit
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2b2c6c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "✅ Logged out successfully",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: "#f0f4ff",
          color: "#2b2c6c",
          iconColor: "#2fb297",
          customClass: {
            popup: "swal2-rounded",
          },
        });
        setTimeout(() => {
          window.location.href = "/Home";
        }, 2500);
      }
    });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action is permanent. Your account will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e03131",
      cancelButtonColor: "#2b2c6c",
      confirmButtonText: "Yes, delete my account",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        axios
          .delete("http://localhost:5000/api/users/delete", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            localStorage.removeItem("token");
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "🗑️ Account deleted successfully",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
              background: "#fff0f0",
              color: "#e03131",
              iconColor: "#e03131",
              customClass: {
                popup: "swal2-rounded",
              },
            });
            setTimeout(() => {
              window.location.href = "/login";
            }, 2500);
          })
          .catch((error) => {
            console.error("Error deleting account:", error);
            Swal.fire(
              "Error",
              "Failed to delete account. Please try again.",
              "error"
            );
          });
      }
    });
  };

  if (loading) {
    return (
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
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "#ffffff",
          }}
        >
          <Typography color="error" variant="h6">
            Failed to load user data
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#2b2c6c",
              "&:hover": { bgcolor: "#1e1f4b" },
            }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get initial letters for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
        backgroundImage:
          "linear-gradient(135deg, rgba(43, 44, 108, 0.05) 0%, rgba(230, 49, 125, 0.05) 100%)",
      }}
    >
      <Card
        elevation={2}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mt: 2,
          borderRadius: 3,
          overflow: "visible",
          position: "relative",
          bgcolor: "#ffffff",
        }}
      >
        {/* Header Banner */}
        <Box
          sx={{
            height: 180,
            bgcolor: "#2b2c6c",
            borderRadius: "12px 12px 0 0",
            backgroundImage:
              "linear-gradient(135deg, #2b2c6c 0%, #1a1b45 100%)",
            position: "relative",
          }}
        />

        {/* Profile Header with Avatar */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            pt: 0,
            pb: 2,
            mt: -8,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "flex-end",
              mb: isMobile ? 2 : 0,
            }}
          >
            <Avatar
              sx={{
                width: 150,
                height: 150,
                border: "5px solid white",
                bgcolor: "#e6317d",
                fontSize: 48,
                fontWeight: "bold",
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box
              sx={{
                ml: isMobile ? 0 : 3,
                mt: isMobile ? 2 : 0,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="#71717d">
                Patient ID: #{user._id?.substring(0, 8)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{
              bgcolor: "#e6317d",
              "&:hover": { bgcolor: "#c62a6a" },
              borderRadius: 2,
              px: 3,
            }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider />

        {/* Profile Content */}
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Left Column - Personal Information */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                  bgcolor: "#ffffff",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#2b2c6c"
                  gutterBottom
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3, bgcolor: "#e6e6e6" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmailIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="#71717d">
                          Email Address
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="#71717d">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.mobile}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <GenderIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="#71717d">
                          Gender
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.gender}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CakeIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                      <Box>
                        <Typography variant="body2" color="#71717d">
                          Date of Birth
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(user.dateOfBirth)}
                          </Typography>
                          <Chip
                            label={`${calculateAge(user.dateOfBirth)} years`}
                            size="small"
                            sx={{
                              ml: 2,
                              bgcolor: "#f0f0f0",
                              fontSize: "0.75rem",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - Medical & Location */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} direction="column">
                {/* Location Info */}
                <Grid item>
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#ffffff" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#2b2c6c"
                      gutterBottom
                    >
                      Location
                    </Typography>
                    <Divider sx={{ mb: 3, bgcolor: "#e6e6e6" }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CountryIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="#71717d">
                              Country
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {user.country}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationIcon sx={{ color: "#2b2c6c", mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="#71717d">
                              City
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {user.city}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Medical Info */}
                <Grid item>
                  <Paper
                    elevation={1}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#ffffff" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="#2b2c6c"
                      gutterBottom
                    >
                      Medical Information
                    </Typography>
                    <Divider sx={{ mb: 3, bgcolor: "#e6e6e6" }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BloodIcon sx={{ color: "#e6317d", mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="#71717d">
                              Blood Group
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Chip
                                label={user.bloodGroup}
                                sx={{
                                  bgcolor: "#f8e0e8",
                                  color: "#e6317d",
                                  fontWeight: "bold",
                                  borderRadius: 1,
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MedicalIcon sx={{ color: "#2fb297", mr: 2 }} />
                          <Box>
                            <Typography variant="body2" color="#71717d">
                              Upcoming Appointment
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              color="#2fb297"
                            >
                              {new Date().getDate() + 5}{" "}
                              {new Date().toLocaleString("default", {
                                month: "long",
                              })}
                              , {new Date().getFullYear()} at 10:30 AM
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            {/* Smart Health Tools Section */}
            {/* Smart Health Tools (Direct Navigation) */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  border: `1px solid ${theme.palette.grey[300]}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#2b2c6c"
                  gutterBottom
                >
                  Smart Health Tools
                </Typography>

                <Grid container spacing={2}>
                  {[
                    {
                      label: "Enter Your Vitals",
                      icon: <MonitorHeartIcon sx={{ color: "#2fb297" }} />,
                      path: "/enter-vitals",
                    },
                    {
                      label: "Run Symptom Analysis",
                      icon: <PsychologyIcon sx={{ color: "#e6317d" }} />,
                      path: "/symptom-analysis",
                    },

                    {
                      label: "Health Trends",
                      icon: <ShowChartIcon sx={{ color: "#2fb297" }} />,
                      path: "/health-trends",
                    },
                    {
                      label: "View Analysis History",
                      icon: <HistoryIcon sx={{ color: "#2b2c6c" }} />,
                      path: "/analysis-history",
                    },
                  ].map(({ label, icon, path }) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          border: `1px solid ${theme.palette.grey[200]}`,
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "#828487",
                          },
                        }}
                        onClick={() => (window.location.href = path)}
                      >
                        <IconButton>{icon}</IconButton>
                        <Typography
                          variant="subtitle1"
                          color="#71717d"
                          fontWeight="medium"
                        >
                          {label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Account Actions Section */}
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 2, bgcolor: "#ffffff" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#2b2c6c"
                  gutterBottom
                >
                  Account Actions
                </Typography>
                <Divider sx={{ mb: 3, bgcolor: "#e6e6e6" }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      borderColor: "#2b2c6c",
                      color: "#2b2c6c",
                      "&:hover": {
                        borderColor: "#1e1f4b",
                        bgcolor: "rgba(43, 44, 108, 0.04)",
                      },
                      borderRadius: 2,
                    }}
                  >
                    Log Out
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteAccount}
                    sx={{
                      bgcolor: "#FF0000",
                      "&:hover": { bgcolor: "#d32f2f" },
                      borderRadius: 2,
                    }}
                  >
                    Delete My Account
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Update Profile Modal */}
      {isEditing && (
        <UpdatePatientProfile
          user={user}
          onClose={() => setIsEditing(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </Box>
  );
}

export default PatientProfile;
