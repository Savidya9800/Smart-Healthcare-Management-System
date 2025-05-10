import React from "react";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Assignment, Event, LocalPharmacy, Person } from "@mui/icons-material";
import DAdminLayout from "./DAdminLayout";

function DDashboard() {
  return (
    <DAdminLayout>
      <h1 className="mb-4 text-2xl font-bold">Doctor Dashboard</h1>
      <Grid container spacing={3}>
        {/* Quick Links */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Assignment />}
                fullWidth
                className="mb-2"
                href="/doctor-leave-management"
              >
                Manage Leaves
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LocalPharmacy />}
                fullWidth
                className="mb-2"
                href="/doctor-prescription-management"
              >
                Manage Prescriptions
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Event />}
                fullWidth
                href="/Doctor-Dashboard/View-Appointment"
              >
                View Appointments
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Total Appointments:</Typography>
                <Typography variant="h6" color="primary">
                  45
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Pending Leaves:</Typography>
                <Typography variant="h6" color="secondary">
                  3
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>Prescriptions Issued:</Typography>
                <Typography variant="h6" color="success">
                  120
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <ul>
                <li>Issued a prescription for John Doe</li>
                <li>Approved leave request for Dr. Smith</li>
                <li>Scheduled an appointment with Jane Doe</li>
                <li>Updated patient records</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DAdminLayout>
  );
}

export default DDashboard;
