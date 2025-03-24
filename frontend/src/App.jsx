import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
=======

//Main Components
>>>>>>> e9ea91d410e8dba479996a63c91f26789c6a73f7
import Home from "./Components/Main Component/Home";
import AboutUs from "./Components/Main Component/AboutUs";
import ContactUs from "./Components/Main Component/ContactUs";
import OurFacilities from "./Components/Main Component/OurFacilities";
import FindADoctor from "./Components/Doctor Component/FindADoctor";
<<<<<<< HEAD
import BookAppointent from "./Components/Appointment Component/BookAppointent"; //BookAppointent

import AppoinmentManagement from "./Components/Appointment Component/AppoinmentAdmin/AppoinmentManagement"; //AppoinmentManagement
import AppoinmentDisplay from "./Components/Appointment Component/DisplayAppoinment"; //BookAppointent
=======
import BookAppointent from "./Components/Appointment Component/BookAppointent";

//User Components
>>>>>>> e9ea91d410e8dba479996a63c91f26789c6a73f7
import UserManagement from "./Components/User Component/UserAdmin/UserManagement";
import MyAccount from "./Components/User Component/UserProfile/MyAccount";
import Login from "./Components/User Component/Login";
import Registration from "./Components/User Component/Registration";
import UDashboard from "./Components/User Component/UserAdmin/Udashboard";

//Pharmacy Components
import PDashboard from "./Components/Pharmacy Component/PDashboard";
import StockAnalytics from "./Components/Pharmacy Component/StockAnalytics";
import OrderAnalytics from "./Components/Pharmacy Component/OrderAnalytics";

//Appointment Components
import ADashboard from "./Components/Appointment Component/ADashboard";

//Doctor Components
import DDashboard from "./Components/Doctor Component/DDashboard";

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
          <Route path="/User-Account" element={<MyAccount />} />
          <Route path="/Find-Doctor" element={<FindADoctor />} />
<<<<<<< HEAD
          <Route path="/Book-Appointment" element={<BookAppointent />} />{/*BookAppointment*/}
          
          
          
          <Route path="/Appoinment-Display" element={<AppoinmentDisplay />} />{/*BookAppointment*/}
          
          <Route path="/Appoinment-Management" element={<AppoinmentManagement />}/>{/*BookAppointment(Admin)*/}
          
          
          <Route path="/User-Management" element={<UserManagement />} />{/*AppoinmentManagement (Admin)*/}
=======
          <Route path="/Book-Appointment" element={<BookAppointent />} />
          <Route path="/User-Management" element={<UserManagement />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/Pharmacy-Dashboard" element={<PDashboard />} />
          <Route path="/Pharmacy-Stocks" element={<StockAnalytics />} />
          <Route path="/Pharmacy-Orders" element={<OrderAnalytics />} />
          <Route path="/User-Dashboard" element={<UDashboard />} />
          <Route path="/Appointment-Dashboard" element={<ADashboard />} />
          <Route path="/Doctor-Dashboard" element={<DDashboard />} />
>>>>>>> e9ea91d410e8dba479996a63c91f26789c6a73f7
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
