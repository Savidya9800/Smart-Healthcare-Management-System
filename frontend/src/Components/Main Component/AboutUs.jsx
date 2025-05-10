import React from "react";
import { 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Avatar,
  Divider
} from "@mui/material";
import { 
  HealthAndSafety, 
  Speed, 
  Security, 
  AccessTime,
  MedicalServices,
  Support,
  Psychology  
} from "@mui/icons-material";
import Nav from "../Nav Component/Nav";
import Footer from "../Nav Component/Footer";

function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#2b2c6c] to-[#1e1f4b] text-white py-20">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: "#2fb297", fontWeight: "bold", letterSpacing: 2 }}>
                ABOUT MEDIFLOW
              </Typography>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                Revolutionizing Healthcare Management
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                Streamlining healthcare operations to enhance patient care and optimize medical facility management
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  bgcolor: "#2fb297", 
                  px: 4, 
                  py: 1.5, 
                  '&:hover': { bgcolor: "#259a82" } 
                }}
              >
                Our Services
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="https://img.freepik.com/free-vector/health-professional-team_52683-36023.jpg"
                alt="Healthcare Team"
                sx={{ 
                  width: '100%', 
                  maxHeight: 400, 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))',
                  borderRadius: 2
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg"
              alt="Our Mission"
              sx={{ width: '100%', borderRadius: 4 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ color: "#2b2c6c", fontWeight: "bold", letterSpacing: 2 }}>
              OUR MISSION
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, color: "#2b2c6c" }}>
              Transforming Healthcare Management
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: "#555" }}>
              MediFlow was founded with a clear vision: to create a comprehensive healthcare management system that addresses the complex challenges faced by modern medical facilities.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: "#555" }}>
              Our platform integrates patient care, pharmacy management, staff scheduling, and administrative functions into one seamless system, enhancing efficiency and improving health outcomes.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: "#2fb297", fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <HealthAndSafety sx={{ mr: 1 }} /> Better Patient Outcomes
              </Typography>
              <Typography variant="h6" sx={{ color: "#e6317d", fontWeight: 600, display: 'flex', alignItems: 'center', mt: 1 }}>
                <Speed sx={{ mr: 1 }} /> Enhanced Operational Efficiency
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Core Features */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: "#2b2c6c", fontWeight: "bold", letterSpacing: 2 }}>
              WHAT MAKES US DIFFERENT
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2, color: "#2b2c6c" }}>
              Our Core Features
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', color: "#666" }}>
              Discover how MediFlow transforms healthcare management with our innovative approach
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar sx={{ bgcolor: '#2b2c6c', width: 60, height: 60, mb: 2 }}>
                    <MedicalServices fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                    Comprehensive Patient Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    From appointment scheduling to treatment plans and medical history tracking, our system provides a complete view of each patient's journey.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar sx={{ bgcolor: '#2fb297', width: 60, height: 60, mb: 2 }}>
                    <Security fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                    Integrated Pharmacy System
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our advanced pharmacy module manages inventory, prescription processing, and medication dispensing with complete traceability and safety checks.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar sx={{ bgcolor: '#e6317d', width: 60, height: 60, mb: 2 }}>
                    <AccessTime fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                    Real-time Analytics
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Gain valuable insights with our powerful analytics dashboard, helping you make data-driven decisions to improve care and operational efficiency.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Team */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: "#2b2c6c", fontWeight: "bold", letterSpacing: 2 }}>
            THE PEOPLE BEHIND MEDIFLOW
          </Typography>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2, color: "#2b2c6c" }}>
            Our Leadership Team
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', color: "#666" }}>
            A dedicated team of healthcare and technology experts committed to improving medical care systems
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Chief Medical Officer",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
              bio: "With over 15 years of clinical experience, Dr. Johnson guides our medical strategy."
            },
            {
              name: "Michael Chen",
              role: "Chief Technology Officer",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
              bio: "Former tech lead at major health systems, Michael drives our technological innovation."
            },
            {
              name: "Dr. James Wilson",
              role: "Head of Research",
              image: "https://randomuser.me/api/portraits/men/67.jpg",
              bio: "Leading our research initiatives to continuously evolve our healthcare solutions."
            }
          ].map((person, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: 'center', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Box sx={{ pt: 4 }}>
                  <Avatar
                    src={person.image}
                    sx={{ width: 120, height: 120, mx: 'auto', border: '4px solid #2fb297' }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#2b2c6c' }}>
                    {person.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                    {person.role}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {person.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Approach */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: "#2b2c6c", fontWeight: "bold", letterSpacing: 2 }}>
              OUR APPROACH
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2, color: "#2b2c6c" }}>
              Why Healthcare Facilities Choose MediFlow
            </Typography>
          </Box>

          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#2b2c6c', width: 80, height: 80, mb: 3 }}>
                  <Support fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                  24/7 Support
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our dedicated support team is always available to assist you with any issues or questions you may have.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#2fb297', width: 80, height: 80, mb: 3 }}>
                  <Psychology fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                  User-Centered Design
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Developed with direct input from healthcare professionals to ensure a system that fits your workflow.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#e6317d', width: 80, height: 80, mb: 3 }}>
                  <Security fontSize="large" />
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#2b2c6c' }}>
                  Industry-Leading Security
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  HIPAA-compliant with advanced encryption and security measures to protect sensitive patient data.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 10, 
          background: 'linear-gradient(45deg, #2b2c6c 30%, #3f3f8f 90%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Transform Your Healthcare Management?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
            Join the growing number of healthcare facilities benefiting from MediFlow's integrated solution
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: "#2fb297", 
                px: 4, 
                py: 1.5, 
                '&:hover': { bgcolor: "#259a82" } 
              }}
            >
              Request Demo
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: "white", 
                color: "white", 
                px: 4, 
                py: 1.5,
                '&:hover': { 
                  borderColor: "white", 
                  bgcolor: "rgba(255,255,255,0.1)" 
                } 
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer Always at Bottom */}
      <Footer />
    </div>
  );
}

export default AboutUs;