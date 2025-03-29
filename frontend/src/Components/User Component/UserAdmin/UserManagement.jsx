import React, { useState } from "react";
import UsersDetails from "./UsersDetails";
import UAdminLayout from "./UAdminLayout";
import AddNewPatient from "./AddNewUser"

function UserManagement() {
  const [showAddPatient, setShowAddPatient] = useState(false);

  const handleAddPatientClick = () => {
    setShowAddPatient(true);
  };

  const handleCloseAddPatient = () => {
    setShowAddPatient(false);
  };

  return (
    <UAdminLayout>
      {showAddPatient ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#2b2c6c]">Add New Patient</h2>
            <button 
              onClick={handleCloseAddPatient}
              className="px-4 py-2 bg-[#71717d] text-white rounded-lg hover:bg-[#828487] transition-colors"
            >
              Back to List
            </button>
          </div>
          <AddNewPatient onSuccess={handleCloseAddPatient} />
        </div>
      ) : (
        <UsersDetails onAddPatientClick={handleAddPatientClick} />
      )}
    </UAdminLayout>
  );
}

export default UserManagement;