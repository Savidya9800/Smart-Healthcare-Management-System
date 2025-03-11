import React from "react";
import { Button, Typography } from "@mui/material";
import Nav from "../Nav Component/Nav";
import Footer from "../Nav Component/Footer";

function AboutUs() {
  return (
    <div>
      <Nav />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Material-UI
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
