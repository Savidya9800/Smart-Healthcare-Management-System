import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../Nav Component/Nav";
import PatientProfile from "./PatientProfile";

function MyAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Home"); // Redirect to home if not authenticated
    } else {
      setLoading(false); // Token found, stop loading and display profile
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while checking token
  }

  return (
    <div>
      <Nav />
      <PatientProfile />
    </div>
  );
}

export default MyAccount;
