import React from "react";
import Nav from "../../Nav Component/Nav";
import SectionHeader from "../../Nav Component/SectionHeader";
import Footer2 from "../../Nav Component/Footer2";
import UsersDetails from "./UsersDetails";

function UserManagement() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Nav />
        <SectionHeader title="PATIENTS MANAGEMENT" />

        {/* Main Content - Table Centered */}
        <div className="flex items-center justify-center flex-grow px-4">
          <UsersDetails /> {/* Table Component */}
        </div>

        {/* Footer Stays at Bottom */}
        <Footer2 />
      </div>
    </div>
  );
}

export default UserManagement;
