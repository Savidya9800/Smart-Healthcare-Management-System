import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AddNewUser from "./Components/User Component/UserAdmin/AddNewUser";

//Pharmacy Components
import PDashboard from "./Components/Pharmacy Component/PDashboard";
import StockAnalytics from "./Components/Pharmacy Component/StockAnalytics";
import OrderAnalytics from "./Components/Pharmacy Component/OrderAnalytics";
import StockAdding from "./Components/Pharmacy Component/StockAdding";
import RecentOrders from "./Components/Prescription Component/RecentOrders";

//Appointment Components
import ADashboard from "./Components/Appointment Component/ADashboard";
import BookAppointent from "./Components/Appointment Component/BookAppointent";
import AppoinmentDisplay from "./Components/Appointment Component/DisplayAppoinment";
import AppoinmentManagement from "./Components/Appointment Component/AppoinmentAdmin/AppoinmentManagement";
import RejectedAppoinment from "./Components/Appointment Component/AppoinmentAdmin/RejectedAppoinmentPage";

//Doctor Components
import DoctorLogin from "./Components/Doctor Component/DoctorLogin";
import DoctorRegistration from "./Components/Doctor Component/DoctorRegistration";
import DDashboard from "./Components/Doctor Component/DDashboard";
import ViewAppointments from "./Components/Doctor Component/ViewAppoinments";
import DoctorLeave from "./Components/Doctor Component/DoctorLeave";
import DoctorDiagnosis from "./Components/Doctor Component/DoctorDiagnosis";
import DiagnosisView from "./Components/Doctor Component/DiagnosisView";

//Novelty Components
import NoveltyComponent from "./Components/Novelty Component/NoveltyComponent";
import AnalysisHistory from "./Components/Novelty Component/AnalysisHistory";
import HealthTrends from "./Components/Novelty Component/HealthTrends";
import VitalsInputForm from "./Components/Novelty Component/VitalsInputForm";
import ChatbotLauncher from "./Components/Novelty Component/ChatbotLauncher";
import HealthChatBot from "./Components/Novelty Component/HealthChatBot";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation(); // get current route

  //  Hide chatbot on login & registration
  const hideChatbotOn = [
    "/login",
    "/registration",
    "/User-Management",
    "/Add-New-Patient",
    "/Pharmacy-Dashboard",
    "/Pharmacy-Stocks",
    "/Pharmacy-Orders",
    "/Stock-Adding",
    "/Appoinment-Management",
    "/Rijected-Appoinment",
    "/Doctor-Dashboard",
    "/Appointment-Dashboard",
    "/User-Dashboard",
  ];
  const showChatbot = !hideChatbotOn.includes(location.pathname);
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
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/User-Dashboard" element={<UDashboard />} />
          <Route path="/User-Account" element={<MyAccount />} />
          <Route path="/Add-New-Patient" element={<AddNewUser />} />

          {/* Novelty Component Route */}
          <Route path="/symptom-analysis" element={<NoveltyComponent />} />
          <Route path="/enter-vitals" element={<VitalsInputForm />} />
          <Route path="/analysis-history" element={<AnalysisHistory />} />
          <Route path="/health-trends" element={<HealthTrends />} />

          {/*Pharmacy Components*/}
          <Route path="/Pharmacy-Dashboard" element={<PDashboard />} />
          <Route path="/Pharmacy-Stocks" element={<StockAnalytics />} />
          <Route path="/Pharmacy-Orders" element={<OrderAnalytics />} />
          <Route path="/Stock-Adding" element={<StockAdding />} />
          <Route path="/recent-orders" element={<RecentOrders />} />

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
          <Route path="/Doctor-Dashboard/Diagnosis" element={<DiagnosisView  />}/>

          {/*Appoinment Components*/}
          <Route path="/Book-Appointment" element={<BookAppointent />} />
          <Route path="/Appoinment-Display" element={<AppoinmentDisplay />} />
          <Route path="/Appointment-Dashboard" element={<ADashboard />} />
          <Route
            path="/Appoinment-Management"
            element={<AppoinmentManagement />}
          />
          <Route path="Rijected-Appoinment" element={<RejectedAppoinment />} />
        </Routes>
        {/*  Conditionally show Chatbot */}
        {showChatbot && (
          <>
            <ChatbotLauncher onOpen={() => setChatOpen(true)} />
            <HealthChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
          </>
        )}
      </React.Fragment>
    </div>
  );
}

export default App;
