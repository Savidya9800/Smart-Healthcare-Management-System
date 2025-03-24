import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav Component/Nav";
import SectionHeader from "../Nav Component/SectionHeader";
import Footer from "../Nav Component/Footer";
import { 
  Phone, 
  Mail, 
  Home, 
  UserCircle, 
  Calendar, 
  Clock,
  Award, 
  Edit, 
  Trash2, 
  CheckCircle, 
  ArrowLeft,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function DisplayAppointment() {
  const [patientDetails, setPatientDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nic: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/appoinment/")
      .then((response) => {
        const lastAppointment = response.data.appoinments[response.data.appoinments.length - 1];
        setPatientDetails(lastAppointment);
        setFormData(lastAppointment);
      })
      .catch((error) => {
        console.error("Error fetching appointment details:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(formData.email)) {
      tempErrors.email = "Enter a valid email in lowercase";
    }

    if (!/^[0-9]{11}[0-9V]$/.test(formData.nic)) {
      tempErrors.nic = "NIC must be 12 characters with first 11 numbers and last character as 'V' or a number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    axios.put(`http://localhost:5000/api/appoinment/${patientDetails._id}`, formData)
      .then((response) => {
        setPatientDetails(formData);
        setIsEditing(false);
        navigate("/Appoinment-Display");
      })
      .catch((error) => {
        console.error("Error updating appointment details:", error);
      });
  };

  const handleConfirm = () => {
    navigate("/Home");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/appoinment/${patientDetails._id}`)
        .then((response) => {
          console.log("Appointment deleted successfully");
          navigate("/Home");
        })
        .catch((error) => {
          console.error("Error deleting appointment:", error);
        });
    }
  };

  if (!patientDetails) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Nav />
        <SectionHeader title="Appointment Details" />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-indigo-600 mb-4 flex justify-center">
              <UserCircle size={64} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-indigo-800 mb-4">No appointment details available</h2>
            <p className="text-gray-600 mb-6">Your appointment information could not be found.</p>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center mx-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Return Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      <SectionHeader title="Appointment Details" />

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 py-5 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {isEditing ? (
                  <>
                    <UserCircle size={20} className="mr-2" />
                    Edit Your Appointment Details
                  </>
                ) : (
                  <>
                    <Calendar size={20} className="mr-2" />
                    Your Appointment Details
                  </>
                )}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {isEditing 
                  ? "Update your personal information" 
                  : `Appointment with ${patientDetails.doctorName} - ${patientDetails.specialization}`}
              </p>
            </div>

            {/* Appointment Summary */}
            {!isEditing && (
              <div className="bg-indigo-50 p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Date & Time</p>
                    <p className="text-indigo-800 font-medium">{patientDetails.date} | {patientDetails.time}</p>
                  </div>
                  <div className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Confirmed
                  </div>
                </div>
              </div>
            )}

            {/* Edit Form */}
            {isEditing ? (
              <div className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={18} className="text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={18} className="text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">NIC</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Award size={18} className="text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        required
                        placeholder="Enter your NIC"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {errors.nic && (
                      <p className="text-rose-500 text-xs mt-1">{errors.nic}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={18} className="text-indigo-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                        <Home size={18} className="text-indigo-500" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter your address"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-20 resize-none"
                      />
                    </div>
                  </div>

                  {/* Buttons - Full Width */}
                  <div className="md:col-span-2 mt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      Save Changes
                      <CheckCircle size={18} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6">
                {/* Display appointment details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Doctor Information */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Doctor</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.doctorName}</p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Specialization</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Stethoscope size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.specialization}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.date}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Time</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.time}</p>
                    </div>
                  </div>

                  {/* Patient Information Header */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-indigo-800">Patient Information</h3>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.name}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.phone}</p>
                    </div>
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">NIC</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Award size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.nic}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700">{patientDetails.email}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                    <div className="relative pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg min-h-[60px]">
                      <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                        <Home size={18} className="text-indigo-500" />
                      </div>
                      <p className="text-gray-700 py-2">{patientDetails.address}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="md:col-span-2 mt-4 grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Details
                    </button>
                    <button
                      onClick={handleDelete}
                      className="py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Cancel Appointment
                    </button>
                  </div>

                  {/* Confirm Button */}
                  <div className="md:col-span-2">
                    <button
                      onClick={handleConfirm}
                      className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Confirm & Return Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Box */}
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border-l-4 border-teal-500 flex items-start">
            <div className="mr-3 text-teal-500 mt-1">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-indigo-800 font-medium text-sm">Important Information</h3>
              <p className="text-xs text-gray-600 mt-1">
                If you need to reschedule your appointment or have any questions, please contact our help desk at <span className="font-medium">1-800-HEALTH</span>.
                Please arrive 15 minutes before your appointment time. Bring your ID and insurance information if applicable.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default DisplayAppointment;