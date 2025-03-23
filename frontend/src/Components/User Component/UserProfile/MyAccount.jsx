import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../Nav Component/Nav";
import PatientProfile from "./PatientProfile";

function MyAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Home"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div>
      <Nav />
      <PatientProfile />
    </div>
  );
}

export default MyAccount;
