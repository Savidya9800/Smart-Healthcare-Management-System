import React, { useState } from "react";
import Nav from "../Nav Component/Nav";
import SectionHeader from "../Nav Component/SectionHeader";
import Footer from "../Nav Component/Footer";
import { Calendar, Stethoscope, PhoneCall, AtSign, MapPin, UserCircle, Clock, Award, ChevronLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BookAppointment() {
  const [errors, setErrors] = useState({});
  const history = useNavigate();

  const [input, setInputs] = useState({
    name: "",
    address: "",
    nic: "",
    phone: "",
    email: "",
    doctorName: "",
    specialization: "",
    date: "",
    time: "",
  });

  const validate = () => {
    let tempErrors = {};

    if (!/^[0-9]{10}$/.test(input.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(input.email)) {
      tempErrors.email = "Enter a valid email in lowercase";
    }

    if (!/^[0-9]{11}[0-9V]$/.test(input.nic)) {
      tempErrors.nic = "NIC must be 12 characters with first 11 numbers and last character as 'V' or a number";
    }

    if (!input.doctorName) {
      tempErrors.doctorName = "Please select a doctor";
    }

    if (!input.specialization) {
      tempErrors.specialization = "Please select a specialization";
    }

    if (!input.date) {
      tempErrors.date = "Please select a date";
    }

    if (!input.time) {
      tempErrors.time = "Please select a time";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setInputs({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/appoinment", input);
      history("/Appoinment-Display");
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  const [step, setStep] = useState(1);

  const doctors = [
    "Dr. John Doe",
    "Dr. Jane Smith",
    "Dr. Michael Brown",
    "Dr. Sarah Davis",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      <SectionHeader title="Book An Appointment" />
      
      <div className="container mx-auto px-4 py-8 flex justify-center">
        {/* Form Container */}
        <div className="w-full max-w-2xl">
          {/* Progress Steps */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? "bg-indigo-600 text-white" : "bg-indigo-800 text-white"}`}>
                  <Calendar size={18} />
                </div>
                <span className={`text-sm mt-2 ${step === 1 ? "text-indigo-600 font-medium" : "text-gray-600"}`}>Appointment</span>
              </div>
              <div className="w-full h-1 mx-4 bg-gray-300 relative">
                <div className={`absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300 ${step === 2 ? "w-full" : "w-0"}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? "bg-indigo-600 text-white" : "bg-gray-400 text-white"}`}>
                  <UserCircle size={18} />
                </div>
                <span className={`text-sm mt-2 ${step === 2 ? "text-indigo-600 font-medium" : "text-gray-600"}`}>Patient Details</span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 py-5 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {step === 1 ? (
                  <>
                    <Calendar size={20} className="mr-2" />
                    Select Your Appointment
                  </>
                ) : (
                  <>
                    <UserCircle size={20} className="mr-2" />
                    Complete Your Details
                  </>
                )}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {step === 1 ? "Choose your preferred doctor and time" : "Please provide your personal information"}
              </p>
            </div>

            {/* Steps Container */}
            <div className="p-6">
              {/* Step 1 Form */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Doctor Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Select Doctor</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={18} className="text-indigo-500" />
                      </div>
                      <select
                        name="doctorName"
                        value={input.doctorName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor, index) => (
                          <option key={index} value={doctor}>
                            {doctor}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.doctorName && (
                      <p className="text-rose-500 text-xs mt-1">{errors.doctorName}</p>
                    )}
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Specialization</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Stethoscope size={18} className="text-indigo-500" />
                      </div>
                      <select
                        name="specialization"
                        value={input.specialization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select specialization</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="General">General Medicine</option>
                      </select>
                    </div>
                    {errors.specialization && (
                      <p className="text-rose-500 text-xs mt-1">{errors.specialization}</p>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Select Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={18} className="text-indigo-500" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={input.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    {errors.date && (
                      <p className="text-rose-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Select Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock size={18} className="text-indigo-500" />
                      </div>
                      <select
                        name="time"
                        value={input.time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select time slot</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                    {errors.time && (
                      <p className="text-rose-500 text-xs mt-1">{errors.time}</p>
                    )}
                  </div>

                  {/* Next Button - Full Width */}
                  <div className="md:col-span-2 mt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      Continue to Patient Details
                      <CheckCircle size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Form */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          value={input.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <PhoneCall size={18} className="text-indigo-500" />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={input.phone}
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
                          value={input.nic}
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
                          <AtSign size={18} className="text-indigo-500" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={input.email}
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

                    {/* Address - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                          <MapPin size={18} className="text-indigo-500" />
                        </div>
                        <textarea
                          name="address"
                          value={input.address}
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
                        onClick={() => setStep(1)}
                        className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center justify-center"
                      >
                        <ChevronLeft size={18} className="mr-1" />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 flex items-center justify-center"
                      >
                        Book Appointment
                        <CheckCircle size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Additional Info - More Compact */}
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border-l-4 border-teal-500 flex items-start">
            <div className="mr-3 text-teal-500 mt-1">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-indigo-800 font-medium text-sm">Important Information</h3>
              <p className="text-xs text-gray-600 mt-1">Please arrive 15 minutes before your appointment time. Bring your ID and insurance information if applicable.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default BookAppointment;