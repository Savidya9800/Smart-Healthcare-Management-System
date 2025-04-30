import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//Main Components
import Home from "./Components/Main Component/Home";
import AboutUs from "./Components/Main Component/AboutUs";
import ContactUs from "./Components/Main Component/ContactUs";
import OurFacilities from "./Components/Main Component/OurFacilities";
import FindADoctor from "./Components/Doctor Component/FindADoctor";

//User Components
import UserManagement from "./Components/User Component/UserAdmin/UserManagement";
import MyAccount from "./Components/User Component/UserProfile/MyAccount";
import Login from "./Components/User Component/Login";
import Registration from "./Components/User Component/Registration";
import UDashboard from "./Components/User Component/UserAdmin/Udashboard";
import ForgotPassword from "./Components/User Component/UserProfile/ForgotPassword";

//Pharmacy Components
import PDashboard from "./Components/Pharmacy Component/PDashboard";
import StockAnalytics from "./Components/Pharmacy Component/StockAnalytics";
import OrderAnalytics from "./Components/Pharmacy Component/OrderAnalytics";
import StockAdding from "./Components/Pharmacy Component/StockAdding";

//Appointment Components
import ADashboard from "./Components/Appointment Component/ADashboard";
import BookAppointent from "./Components/Appointment Component/BookAppointent";
import AppoinmentDisplay from "./Components/Appointment Component/DisplayAppoinment";
import AppoinmentManagement from "./Components/Appointment Component/AppoinmentAdmin/AppoinmentManagement";

//Doctor Components
import DoctorLogin from "./Components/Doctor Component/DoctorLogin";
import DoctorRegistration from "./Components/Doctor Component/DoctorRegistration";
import DDashboard from "./Components/Doctor Component/DDashboard";
import ViewAppointments from "./Components/Doctor Component/ViewAppoinments";
import DoctorLeave from "./Components/Doctor Component/DoctorLeave";
import DoctorDiagnosis from "./Components/Doctor Component/DoctorDiagnosis";

import AddNewUser from "./Components/User Component/UserAdmin/AddNewUser";
import NoveltyComponent from "./Components/Novelty Component/NoveltyComponent";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/About-Us" element={<AboutUs />} />
          <Route path="/Contact-Us" element={<ContactUs />} />
          <Route path="/Our-Facilities" element={<OurFacilities />} />
          <Route path="/Find-Doctor" element={<FindADoctor />} />
          {/*User Components*/}
          <Route path="/User-Management" element={<UserManagement />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/User-Dashboard" element={<UDashboard />} />
          <Route path="/User-Account" element={<MyAccount />} />
          <Route path="/Add-New-Patient" element={<AddNewUser />} />
          {/* Novelty Component Route */}
          <Route
            path="/Novelty-Component"
            element={<NoveltyComponent />}
          />{" "}
          {/* Add Novelty Component route */}
          {/*Pharmacy Components*/}
          <Route path="/Pharmacy-Dashboard" element={<PDashboard />} />
          <Route path="/Pharmacy-Stocks" element={<StockAnalytics />} />
          <Route path="/Pharmacy-Orders" element={<OrderAnalytics />} />
          <Route path="/Stock-Adding" element={<StockAdding />} />
          {/*Doctor Components*/}
          <Route path="/login-doctor" element={<DoctorLogin />} />
          <Route path="/register-doctor" element={<DoctorRegistration />} />
          <Route path="/Doctor-Dashboard" element={<DDashboard />} />
          <Route
            path="/Doctor-Dashboard/View-Appointment"
            element={<ViewAppointments />}
          />
          <Route path="/Doctor-Dashboard/Leave" element={<DoctorLeave />} />
          <Route
            path="/Doctor-Dashboard/appointmnet/Diagnosis/:appointmentId"
            element={<DoctorDiagnosis />}
          />
          {/*Appoinment Components*/}
          <Route path="/Book-Appointment" element={<BookAppointent />} />
          <Route path="/Appoinment-Display" element={<AppoinmentDisplay />} />
          <Route path="/Appointment-Dashboard" element={<ADashboard />} />
          <Route
            path="/Appoinment-Management"
            element={<AppoinmentManagement />}
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
