import React from "react";
import AAdminLayout from "../AAdminLayout";

import RejectedAppointments from "./RejectedAppointments";

function RejectedAppoinmentManagement() {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <AAdminLayout>
          <RejectedAppointments />
        </AAdminLayout>
      </div>
    </div>
  );
}

export default RejectedAppoinmentManagement;
