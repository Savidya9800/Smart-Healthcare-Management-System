import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Components/Main Component/Home";
import AboutUs from "./Components/Main Component/AboutUs";
import ContactUs from "./Components/Main Component/ContactUs";
import OurFacilities from "./Components/Main Component/OurFacilities";
import MyAccount from "./Components/User Component/MyAccount";
import FindADoctor from "./Components/Doctor Component/FindADoctor";
import BookAppointent from "./Components/Appointment Component/BookAppointent"; //BookAppointent

import AppoinmentManagement from "./Components/Appointment Component/AppoinmentAdmin/AppoinmentManagement"; //AppoinmentManagement
import AppoinmentDisplay from "./Components/Appointment Component/DisplayAppoinment"; //BookAppointent
import UserManagement from "./Components/User Component/UserAdmin/UserManagement";

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
          <Route path="/Book-Appointment" element={<BookAppointent />} />{/*BookAppointment*/}
          
          
          
          <Route path="/Appoinment-Display" element={<AppoinmentDisplay />} />{/*BookAppointment*/}
          
          <Route path="/Appoinment-Management" element={<AppoinmentManagement />}/>{/*BookAppointment(Admin)*/}
          
          
          <Route path="/User-Management" element={<UserManagement />} />{/*AppoinmentManagement (Admin)*/}
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
