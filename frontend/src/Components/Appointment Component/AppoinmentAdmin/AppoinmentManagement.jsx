import React from "react";
import AAdminLayout from "../AAdminLayout";
import Appointments from "./Appoinments";

function AppoinmentManagement() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <AAdminLayout>
          <Appointments />
        </AAdminLayout>
      </div>
    </div>
  );
}

export default AppoinmentManagement;
