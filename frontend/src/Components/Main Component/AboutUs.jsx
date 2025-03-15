import React from "react";
import { Button, Typography } from "@mui/material";
import Nav from "../Nav Component/Nav";
import Footer from "../Nav Component/Footer";

function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 text-center">
        <Typography variant="h4" gutterBottom>
          Welcome to Material-UI
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>

      {/* Footer Always at Bottom */}
      <Footer />
    </div>
  );
}

export default AboutUs;
