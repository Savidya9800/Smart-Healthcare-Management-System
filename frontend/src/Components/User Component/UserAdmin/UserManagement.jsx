import React, { useState } from "react";
import UsersDetails from "./UsersDetails";
import UAdminLayout from "./UAdminLayout";
function UserManagement() {
  return (
    <UAdminLayout>
      <UsersDetails />
    </UAdminLayout>
  );
}

export default UserManagement;
