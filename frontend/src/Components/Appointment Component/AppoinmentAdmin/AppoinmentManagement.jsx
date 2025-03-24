import React from "react";
import Nav from "../../Nav Component/Nav";
import SectionHeader from "../../Nav Component/SectionHeader";
import Footer2 from "../../Nav Component/Footer2";
import Appointments from "./Appoinments";


function AppoinmentManagement() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Nav />
        <SectionHeader title="APPOINMENT MANAGEMENT" />

        {/* Main Content - Table Centered */}
        
          <Appointments /> {/* Table Component */}
        

        {/* Footer Stays at Bottom */}
        <Footer2 />
      </div>
    </div>
  );
}

export default AppoinmentManagement;
