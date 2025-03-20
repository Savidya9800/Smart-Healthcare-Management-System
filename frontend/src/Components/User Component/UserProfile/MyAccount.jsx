import React from "react";
import Nav from "../../Nav Component/Nav";
import PatientProfile from "./PatientProfile";
import { Box } from "@mui/material";

function MyAccount() {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Nav />
      <PatientProfile />
    </Box>
  );
}

export default MyAccount;