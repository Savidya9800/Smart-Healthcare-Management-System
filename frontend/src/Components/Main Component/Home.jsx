import React, { useState, useEffect } from "react";
import Nav from "../Nav Component/Nav";
import Footer from "../Nav Component/Footer";
import { 
  Button, Container, Card, CardContent, Typography, 
  Grid, Box, TextField, Chip, Divider, Paper
} from "@mui/material";
import { 
  HealthAndSafety, AccessTime, MedicalServices, People, 
  ArrowForward, Star, PhoneInTalk, Analytics, Shield,
  Schedule, VideoCall, BarChart, Description
} from "@mui/icons-material";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Handle scroll effect for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial data
  const testimonials = [
    {
      quote: "The smart healthcare system has transformed my medical experience. Appointments are seamless, and I can access my records anytime. The care is truly exceptional!",
      name: "Sarah Johnson",
      since: "Patient since 2023"
    },
    {
      quote: "As someone with a chronic condition, this platform has been life-changing. The virtual consultations save me time and the health tracking keeps me informed.",
      name: "Michael Chen",
      since: "Patient since 2022"
    },
    {
      quote: "I was skeptical about digital healthcare, but this system changed my mind. It's intuitive, secure, and the doctors are just as attentive as in-person.",
      name: "Elena Rodriguez",
      since: "Patient since 2024"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f8f9ff] to-[#f0f8ff]">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#e6317d]/10 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-[40rem] h-[40rem] rounded-full bg-[#2FB297]/10 blur-3xl"></div>
        
        <Container maxWidth="lg" className="py-24 relative z-10">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="p-4">
                <Chip 
                  label="NEXT-GEN HEALTHCARE" 
                  className="!bg-[#e6317d]/10 !text-[#e6317d] !font-semibold !mb-6 !px-3 !py-3"
                />
                <Typography variant="h1" className="text-[#2b2c6c] font-bold text-5xl md:text-6xl mb-4 leading-tight">
                  Healthcare <br />
                  <span className="text-[#e6317d] relative">
                    Reimagined
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="#e6317d" strokeWidth="2"/>
                    </svg>
                  </span>
                </Typography>
                <Typography variant="body1" className="text-[#71717d] mb-8 max-w-md text-lg">
                  Experience healthcare that combines cutting-edge AI technology with compassionate care, perfectly tailored to your needs.
                </Typography>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  <Button
                    variant="contained"
                    className="!bg-gradient-to-r !from-[#2b2c6c] !to-[#4e4fa3] !text-white !px-8 !py-3 !rounded-full !text-lg !font-medium hover:!shadow-xl transition-all duration-300"
                    endIcon={<ArrowForward />}
                  >
                    Get Started
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-[${i % 2 ? '#2b2c6c' : '#2FB297'}] text-white font-bold`}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="text-[#e6317d]" fontSize="small" />
                      ))}
                    </div>
                    <Typography variant="body2" className="text-[#71717d]">
                      Trusted by <span className="font-bold">12,000+</span> patients
                    </Typography>
                  </div>
                </div>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className="relative">
                {/* Floating features cards */}
                <Paper elevation={4} className="absolute -top-8 -left-8 p-4 rounded-2xl bg-white/90 backdrop-blur-md w-48 z-20 transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#2FB297]/10 flex items-center justify-center">
                      <HealthAndSafety className="text-[#2FB297]" />
                    </div>
                    <div>
                      <Typography variant="caption" className="text-[#71717d] block">
                        Smart Health
                      </Typography>
                      <Typography variant="body2" className="text-[#2b2c6c] font-bold">
                        AI Diagnostics
                      </Typography>
                    </div>
                  </div>
                </Paper>
              
                {/* Main image */}
                <Box className="relative z-10">
                  <Box className="absolute -z-10 w-full h-full bg-gradient-to-br from-[#2b2c6c]/20 to-[#e6317d]/20 rounded-5xl transform rotate-3 scale-105 blur-md"></Box>
                  <Paper elevation={0} className="rounded-3xl overflow-hidden border border-white/30 shadow-xl">
                    <img
                      src="/Home1.jpg"
                      alt="Healthcare professionals"
                      className="w-full h-auto rounded-xl"
                    />
                  </Paper>
                </Box>
                
                {/* Floating support card */}
                <Paper elevation={4} className="absolute -bottom-8 -right-8 p-4 rounded-2xl bg-white/90 backdrop-blur-md w-48 z-20 transform transition-transform duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#e6317d]/10 flex items-center justify-center">
                      <PhoneInTalk className="text-[#e6317d]" />
                    </div>
                    <div>
                      <Typography variant="caption" className="text-[#71717d] block">
                        24/7 Support
                      </Typography>
                      <Typography variant="body2" className="text-[#2b2c6c] font-bold">
                        Always Available
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
      
      {/* Stats Section */}
      <Container maxWidth="lg" className={`py-16 transition-all duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        <Grid container spacing={4} className="mb-20">
          {[
            { number: "98%", label: "Patient Satisfaction", color: "#2b2c6c", icon: <Star /> },
            { number: "24/7", label: "Medical Support", color: "#e6317d", icon: <PhoneInTalk /> },
            { number: "500+", label: "Expert Doctors", color: "#2FB297", icon: <MedicalServices /> },
            { number: "15k+", label: "Active Patients", color: "#71717d", icon: <People /> }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card className="h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-2" style={{ backgroundColor: stat.color }}></div>
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}10` }}>
                    {React.cloneElement(stat.icon, { style: { color: stat.color } })}
                  </div>
                  <Typography variant="h3" className="font-bold mb-2" style={{ color: stat.color }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" className="text-[#71717d]">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* About Section */}
        <Grid container spacing={10} alignItems="center" className="mb-20">
          <Grid item xs={12} md={5}>
            <div className="relative">
              <Box className="absolute -z-10 w-full h-full bg-gradient-to-br from-[#2FB297]/20 to-[#e6317d]/20 rounded-3xl transform -rotate-3 scale-105 blur-md"></Box>
              <Paper elevation={0} className="rounded-3xl overflow-hidden border border-white/30 shadow-xl">
                <img
                  src="/Home2.jpg"
                  alt="Doctor with patient"
                  className="w-full h-auto"
                />
              </Paper>
              <Box className="absolute -bottom-6 right-6 p-5 bg-gradient-to-r from-[#2b2c6c] to-[#4e4fa3] rounded-2xl text-white max-w-xs shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center gap-3 mb-0">
                  <Analytics className="text-white" />
                  <Typography variant="subtitle1" className="font-bold">
                    Smart AI Diagnostics
                  </Typography>
                </div>
                <Typography variant="body2">
                  Our AI system provides preliminary analysis to assist doctors in making accurate diagnoses faster
                </Typography>
              </Box>
            </div>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h3" className="text-[#2b2c6c] font-bold mb-6 text-4xl">
              Smart Technology Meets <span className="text-[#e6317d]">Compassionate Care</span>
            </Typography>
            <Typography variant="body1" className="text-[#71717d] mb-8 text-lg">
              Our healthcare management system combines cutting-edge technology with human-centered care. We believe that technology should enhance the patient-doctor relationship, not replace it.
            </Typography>
            
            <Grid container spacing={4} className="mb-8">
              {[
                { 
                  icon: <HealthAndSafety className="text-[#e6317d] text-2xl" />, 
                  title: "Holistic Care",
                  description: "Treating the whole person, not just symptoms"
                },
                { 
                  icon: <Analytics className="text-[#2FB297] text-2xl" />, 
                  title: "Smart Analytics",
                  description: "Data-driven insights for better healthcare"
                },
                { 
                  icon: <Shield className="text-[#2b2c6c] text-2xl" />, 
                  title: "Data Security",
                  description: "HIPAA-compliant, end-to-end encryption"
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card className="h-full p-4 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                    <Box className="flex flex-col gap-3">
                      <Box className="p-3 rounded-lg" style={{ backgroundColor: `${feature.icon.props.className.includes('text-[#e6317d]') ? '#e6317d10' : feature.icon.props.className.includes('text-[#2FB297]') ? '#2FB29710' : '#2b2c6c10'}` }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" className="font-bold text-[#2b2c6c]">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className="text-[#71717d]">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      
      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-br from-[#2b2c6c] to-[#1f2050]">
        <Container maxWidth="lg" className="relative z-10">
          <Grid container spacing={6} className="mb-12">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" className="font-bold text-white mb-4">
                Smart Features for Modern Healthcare
              </Typography>
              <Typography variant="body1" className="text-white/80 mb-6">
                Our platform combines cutting-edge technology with compassionate care to deliver a healthcare experience that's truly revolutionary.
              </Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={4}>
            {[
              {
                icon: <Schedule className="text-[#2b2c6c] text-3xl" />,
                title: "Smart Scheduling",
                description: "AI-powered appointment system that matches you with the right specialist based on your needs and history.",
                bg: "bg-white",
                accent: "border-t-[#2b2c6c]"
              },
              {
                icon: <VideoCall className="text-[#e6317d] text-3xl" />,
                title: "Virtual Consultations",
                description: "Connect with healthcare professionals from anywhere with secure HD video conferencing.",
                bg: "bg-white",
                accent: "border-t-[#e6317d]"
              },
              {
                icon: <BarChart className="text-[#2fb297] text-3xl" />,
                title: "Health Analytics",
                description: "Track your vital statistics and health metrics in real-time with smart device integration.",
                bg: "bg-white",
                accent: "border-t-[#2fb297]"
              },
              {
                icon: <Description className="text-[#71717d] text-3xl" />,
                title: "Digital Records",
                description: "Access your complete medical history securely anytime, with blockchain-secured data protection.",
                bg: "bg-white",
                accent: "border-t-[#71717d]"
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className={`h-full rounded-xl shadow-lg overflow-hidden ${feature.bg} border-t-4 ${feature.accent} hover:shadow-xl transition-all duration-300 group`}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <Typography variant="h6" className="font-bold text-[#71717d] mb-3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-[#828487]">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" className="py-24">
        <Grid container spacing={4} className="mb-16">
          <Grid item xs={12} md={6}>
            <Chip 
              label="TESTIMONIALS" 
              className="!bg-[#e6317d]/10 !text-[#e6317d] !font-semibold !mb-4 !px-3"
            />
            <Typography variant="h3" className="text-[#2b2c6c] font-bold mb-4 text-4xl">
              What Our <span className="text-[#e6317d]">Patients</span> Say
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className="flex justify-end items-center">
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-[#e6317d] w-8' : 'bg-[#e6317d]/30'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </Grid>
        </Grid>
        
        <div className="relative">
          <Box className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((item, index) => (
                <div key={index} className="min-w-full px-4">
                  <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <CardContent className="p-10 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2FB297]/5 rounded-bl-full"></div>
                      
                      <div className="flex items-center gap-1 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="text-[#e6317d]" />
                        ))}
                      </div>
                      
                      <Typography variant="h5" className="text-[#2b2c6c] font-light italic mb-8 text-xl leading-relaxed">
                        "{item.quote}"
                      </Typography>
                      
                      <Divider className="mb-8" />
                      
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2b2c6c] to-[#4e4fa3] flex items-center justify-center text-white font-bold text-xl">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <Typography variant="h6" className="font-bold text-[#2b2c6c]">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" className="text-[#71717d]">
                            {item.since}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </Container>
      
      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f8faff] to-[#eef8ff] py-24">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#e6317d]/10 blur-3xl"></div>
        
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={5}>
              <Chip 
                label="GET STARTED" 
                className="!bg-[#2FB297]/10 !text-[#2FB297] !font-semibold !mb-4 !px-3"
              />
              <Typography variant="h3" className="text-[#2b2c6c] font-bold mb-4 text-4xl">
                Join Our <span className="text-[#e6317d]">Healthcare</span> Family Today
              </Typography>
              <Typography variant="body1" className="text-[#71717d] mb-8 text-lg">
                Experience healthcare that puts you first. Sign up to get started with our smart healthcare management system.
              </Typography>
              
              <Box className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
                <Box className="w-14 h-14 rounded-full bg-[#e6317d]/10 flex items-center justify-center">
                  <PhoneInTalk className="text-[#e6317d]" />
                </Box>
                <Box>
                  <Typography variant="caption" className="text-[#71717d]">
                    Need immediate assistance?
                  </Typography>
                  <Typography variant="h6" className="text-[#2b2c6c] font-bold">
                    1-800-HEALTH-CARE
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Card className="rounded-2xl shadow-2xl overflow-hidden border-t-4 border-[#2b2c6c]">
                <CardContent className="p-8">
                  <Typography variant="h5" className="text-[#2b2c6c] font-bold mb-8">
                    Request More Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="First Name" 
                        variant="outlined" 
                        fullWidth
                        className="!rounded-lg"
                        InputProps={{
                          className: "!rounded-xl !bg-gray-50 !border-0"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        label="Last Name" 
                        variant="outlined" 
                        fullWidth
                        InputProps={{
                          className: "!rounded-xl !bg-gray-50 !border-0"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        label="Email Address" 
                        variant="outlined" 
                        fullWidth
                        InputProps={{
                          className: "!rounded-xl !bg-gray-50 !border-0"
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        className="!bg-gradient-to-r !from-[#2b2c6c] !to-[#4e4fa3] !text-white !py-4 !text-lg !rounded-xl hover:!shadow-xl transition-all duration-300"
                      >
                        Submit Request
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>

      <Footer />
    </div>
  );
}

export default Home;