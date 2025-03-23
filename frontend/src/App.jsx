import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Components/Main Component/Home";
import AboutUs from "./Components/Main Component/AboutUs";
import ContactUs from "./Components/Main Component/ContactUs";
import OurFacilities from "./Components/Main Component/OurFacilities";
import FindADoctor from "./Components/Doctor Component/FindADoctor";
import BookAppointent from "./Components/Appointment Component/BookAppointent";
import UserManagement from "./Components/User Component/UserAdmin/UserManagement";
import MyAccount from "./Components/User Component/UserProfile/MyAccount";
import Login from "./Components/User Component/Login";
import Registration from "./Components/User Component/Registration";
import Example from "./Components/User Component/UserAdmin/example";

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
          <Route path="/Book-Appointment" element={<BookAppointent />} />
          <Route path="/User-Management" element={<UserManagement />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/example" element={<Example />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
