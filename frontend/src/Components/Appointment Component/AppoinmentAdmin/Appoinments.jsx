import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Collapse,
  Chip,
  Button,
  Card,
  Divider,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // For NIC
import HomeIcon from "@mui/icons-material/Home"; // For Address
import CopyrightIcon from "@mui/icons-material/Copyright";

// Color palette
const colors = {
  darkGray: "#71717D",
  gray: "#828487",
  pink: "#E6317D",
  white: "#FFFFFF",
  blue: "#2B2C6C",
  green: "#2FB297"
};

const URL = "http://localhost:5000/api/appoinment";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

// Individual appointment row component with collapse functionality
function AppointmentRow({ appointment, index, onAccept, onReject }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        sx={{ 
          "&:hover": { backgroundColor: "#f9f9f9" },
          transition: "background-color 0.3s",
          borderLeft: open ? `4px solid ${colors.pink}` : "4px solid transparent",
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: "600", color: colors.darkGray }}>{appointment.indexno}</TableCell>
        <TableCell sx={{ fontWeight: "500" }}>{appointment.name}</TableCell>
        <TableCell align="center">
          <Chip 
            icon={<LocalHospitalIcon />} 
            label={appointment.specialization} 
            size="small" 
            sx={{ 
              bgcolor: `${colors.blue}20`, 
              color: colors.blue,
              fontWeight: "500",
            }} 
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventIcon fontSize="small" sx={{ color: colors.gray }} />
            {new Date(appointment.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ color: colors.gray }} />
            {appointment.time}
          </Box>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <IconButton 
              sx={{ 
                backgroundColor: `${colors.green}20`, 
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": { 
                  backgroundColor: `${colors.green}30`,
                  transform: "translateY(-2px)"
                }
              }} 
              onClick={() => onAccept(index)}
            >
              <CheckCircleIcon sx={{ color: colors.green }} />
            </IconButton>
            <IconButton 
              sx={{ 
                backgroundColor: `${colors.pink}20`, 
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": { 
                  backgroundColor: `${colors.pink}30`,
                  transform: "translateY(-2px)"
                }
              }} 
              onClick={() => onReject(index)}
            >
              <CancelIcon sx={{ color: colors.pink }} />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      
      {/* Expandable row content */}
      <TableRow>
        <TableCell sx={{ paddingY: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card sx={{ m: 2, borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <Box sx={{ 
                p: 2, 
                display: "flex", 
                justifyContent: "space-between",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #eaecef"
              }}>
                <Typography variant="h6" sx={{ fontWeight: "600", color: colors.blue }}>
                  Patient Details
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" sx={{ color: colors.gray }} />
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {appointment.indexno}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: `${colors.blue}10`, 
                      borderRadius: "8px", 
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <CreditCardIcon sx={{ color: colors.blue }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">NIC</Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }}>{appointment.nic}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: `${colors.green}10`, 
                      borderRadius: "8px", 
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <PhoneIcon sx={{ color: colors.green }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }}>{appointment.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: `${colors.pink}10`, 
                      borderRadius: "8px", 
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <EmailIcon sx={{ color: colors.pink }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }}>{appointment.email}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: `${colors.darkGray}10`, 
                      borderRadius: "8px", 
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <HomeIcon sx={{ color: colors.darkGray }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }} noWrap>
                        {appointment.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ fontWeight: "600", color: colors.blue, mb: 2 }}>
                  Doctor Information
                </Typography>
                
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Doctor Name</Typography>
                    <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }}>{appointment.doctorName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Specialization</Typography>
                    <Typography variant="body1" fontWeight="500" sx={{ color: colors.darkGray }}>{appointment.specialization}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderTop: "1px solid #eaecef", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderColor: colors.gray, 
                    color: colors.gray,
                    "&:hover": { borderColor: colors.darkGray, color: colors.darkGray }
                  }}
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => onAccept(index)}
                  sx={{ 
                    bgcolor: colors.pink, 
                    "&:hover": { bgcolor: "#d02b6e" },
                    textTransform: "none"
                  }}
                >
                  Accept Appointment
                </Button>
              </Box>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


  
 


function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log("Fetched Appointments:", data.appoinments);
      setAppointments(data.appoinments);
    });
  }, []);

  const handleAccept = (index) => {
    setSnackbarMessage("Appointment accepted successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleReject = (index) => {
    setSnackbarMessage("Appointment rejected.");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "67vh" }}>
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: "600", 
            color: colors.blue,
            borderBottom: `3px solid ${colors.pink}`,
            display: "inline-block",
            pb: 1
          }}
        >
          
        </Typography>
        
        <Card sx={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.green }}>
                  <TableCell width="50px" sx={{ color: colors.white }}></TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }}>Appointment ID</TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }}>Patient Name</TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }} align="center">Specialization</TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: "600", fontSize: "1.1rem", color: colors.white }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <AppointmentRow 
                      key={index} 
                      appointment={appointment} 
                      index={index}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: "50%", 
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <EventIcon sx={{ fontSize: 40, color: colors.gray }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: colors.darkGray }}>
                          No Appointments Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          New appointment requests will appear here
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Snackbar for Success / Error Messages */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ 
              width: "100%",
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
              borderRadius: "10px",
              bgcolor: snackbarSeverity === "success" ? colors.green : colors.pink,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      
     
    </Box>
  );
}

export default Appointments;