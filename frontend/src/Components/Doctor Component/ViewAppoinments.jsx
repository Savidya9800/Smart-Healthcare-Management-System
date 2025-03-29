import React, { useState, useEffect } from "react";
import DAdminLayout from "./DAdminLayout"; // Adjust the import path as necessary

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Retrieve doctor data from sessionStorage
    const storedDoctor = sessionStorage.getItem("doctor");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appoinment"); // Update with actual backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        console.log(data);

        // Store all appointments
        setAppointments(data.appoinments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (doctor && appointments.length > 0) {
      // Filter appointments for the logged-in doctor
      const assignedAppointments = appointments.filter(
        (appointment) => appointment.doctor_id === doctor._id
      );
      setFilteredAppointments(assignedAppointments);
    }
  }, [doctor, appointments]);

  return (
    <DAdminLayout>
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

      {loading ? (
        <p className="text-gray-600">Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredAppointments.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Index</th>
              <th className="border p-2">Patient Name</th>
              <th className="border p-2">Specialization</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{appointment.indexno}</td>
                <td className="border p-2">{appointment.name}</td>
                <td className="border p-2">{appointment.specialization}</td>
                <td className="border p-2">
                  {new Date(appointment.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{appointment.time}</td>
                <td className="border p-2">{appointment.phone}</td>
                <td className="border p-2">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No assigned appointments found.</p>
      )}
    </div>
    </DAdminLayout>
  );
}

export default ViewAppointments;
