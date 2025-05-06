import React, { useState, useEffect } from "react";
import Nav from "../Nav Component/Nav";
import SectionHeader from "../Nav Component/SectionHeader";
import Footer from "../Nav Component/Footer";
import {
  Calendar,
  Stethoscope,
  PhoneCall,
  Mail,
  MapPin,
  UserCircle,
  Clock,
  Award ,
  ChevronLeft,
  CheckCircle,
  IdCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BookAppointment() {
  const [errors, setErrors] = useState({});
  const history = useNavigate();
  const [doctors, setDoctors] = useState([]);

  const [input, setInputs] = useState({
    name: "",
    address: "",
    nic: "",
    phone: "",
    email: "",
    doctorName: "",
    doctor_id: "",
    specialization: "",
    date: "",
    time: "",
  });

  const validateStep1 = () => {
    let tempErrors = {};
    let isValid = true;

    if (!input.doctorName) {
      tempErrors.doctorName = "Please select a doctor";
      isValid = false;
    }
    if (!input.specialization) {
      tempErrors.specialization = "Please select a specialization";
      isValid = false;
    }
    if (!input.date) {
      tempErrors.date = "Please select a date";
      isValid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(input.date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        tempErrors.date = "Appointment date cannot be in the past";
        isValid = false;
      }
    }
    if (!input.time) {
      tempErrors.time = "Please select a time slot";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const validate = () => {
    let tempErrors = {};

    if (!/^[A-Za-z\s]+$/.test(input.name)) {
      tempErrors.name = "Name cannot contain numbers";
    }
    if (!/^0[0-9]{9}$/.test(input.phone)) {
      tempErrors.phone = "Phone number must start with 0 and be 10 digits";
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(input.email)) {
      tempErrors.email = "Enter a valid email";
    }
    if (!/^[0-9]{11}[0-9V]$/.test(input.nic)) {
      tempErrors.nic = "Invalid NIC";
    }
    if (input.address.length > 30) {
      tempErrors.address = "Address must be 30 characters or less";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "doctorName") {
      const selectedDoctor = doctors.find((doctor) => doctor._id === value);
      setInputs({
        ...input,
        doctor_id: selectedDoctor ? selectedDoctor._id : "",
        doctorName: selectedDoctor ? selectedDoctor.name : "",
        specialization: selectedDoctor ? selectedDoctor.specialization : ""
      });
    } else {
      setInputs({ ...input, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/appoinment", {
        ...input,
        doctor_id: input.doctor_id,
      });

      history("/Appoinment-Display");
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const [step, setStep] = useState(1);

  return (
    <div className="bg-[#ffffff] min-h-screen">
      <Nav />
      <SectionHeader title="Book An Appointment" />

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center w-full max-w-md">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step === 1
                      ? "bg-[#2b2c6c] text-white"
                      : "bg-[#828487] text-white"
                  }`}
                >
                  <Calendar size={24} />
                </div>
                <span
                  className={`text-sm mt-2 ${
                    step === 1 ? "text-[#2b2c6c] font-medium" : "text-[#828487]"
                  }`}
                >
                  Appointment
                </span>
              </div>
              <div className="w-full h-1 mx-4 bg-[#828487] relative">
                <div
                  className={`absolute top-0 left-0 h-full bg-[#2b2c6c] transition-all duration-300 ${
                    step === 2 ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step === 2
                      ? "bg-[#2b2c6c] text-white"
                      : "bg-[#828487] text-white"
                  }`}
                >
                  <UserCircle size={24} />
                </div>
                <span
                  className={`text-sm mt-2 ${
                    step === 2 ? "text-[#2b2c6c] font-medium" : "text-[#828487]"
                  }`}
                >
                  Patient Details
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#eaecee] rounded-xl shadow-lg overflow-hidden border border-[#2fb297#2fb297]">
            <div className="bg-gradient-to-r from-[#2b2c6c] to-[#e6317d] py-5 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {step === 1 ? (
                  <>
                    <Calendar size={24} className="mr-2" />
                    Select Your Appointment
                  </>
                ) : (
                  <>
                    <UserCircle size={24} className="mr-2" />
                    Complete Your Details
                  </>
                )}
              </h2>
              <p className="text-gray-200 mt-1">
                {step === 1
                  ? "Choose your preferred doctor and time"
                  : "Please provide your personal information"}
              </p>
            </div>

            <div className="p-6">
              {/* Step 1 Form */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Select Doctor
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={24} className="text-[#2b2c6c]" />
                      </div>
                      <select
                        name="doctorName"
                        value={input.doctor_id}  // Use doctor_id instead
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.doctorName && (
                      <p className="text-[#e6317d] text-xs mt-1">
                        {errors.doctorName}
                      </p>
                    )}
                  </div>

                  <div>
  <label className="block text-gray-700 text-base font-medium mb-2">
    Specialization
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Stethoscope size={24} className="text-[#2b2c6c]" />
    </div>
    {input.doctor_id ? (
      <input
        name="specialization"
        value={input.specialization}
        readOnly
        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
      />
    ) : (
      <select
        name="specialization"
        value={input.specialization}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
      >
        <option value="">Select specialization</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        <option value="Orthopedics">Orthopedics</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Dermatology">Dermatology</option>
        <option value="General">General Medicine</option>
      </select>
    )}
  </div>
  {errors.specialization && (
    <p className="text-[#e6317d] text-xs mt-1">
      {errors.specialization}
    </p>
  )}
</div>

                  <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={24} className="text-[#2b2c6c]" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={input.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                      />
                    </div>
                    {errors.date && (
                      <p className="text-[#e6317d] text-xs mt-1">
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Select Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock size={24} className="text-[#2b2c6c]" />
                      </div>
                      <select
                        name="time"
                        value={input.time}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                      >
                        <option value="">Select time slot</option>
                        <option value="07:00 AM">06:00 AM - 07:00 AM</option>
                        <option value="11:00 AM">07:00 AM - 08:00 AM</option>
                        <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                        <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                        <option value="07:00 PM">07:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                    {errors.time && (
                      <p className="text-[#e6317d] text-xs mt-1">
                        {errors.time}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <div className="md:col-span-2 mt-4">
                      <button
                        onClick={() => {
                          if (validateStep1()) {
                            setStep(2);
                          }
                        }}
                        className={`w-full py-2.5 ${
                          !input.doctorName ||
                          !input.specialization ||
                          !input.date ||
                          !input.time
                            ? "bg-[#2b2c6c] hover:bg-gray-400 cursor-not-allowed"
                            : "bg-[#2b2c6c] hover:bg-gray-400"
                        } text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center`}
                        style={{ borderRadius: "7px" }}
                        type="button"
                      >
                        Continue to Patient Details
                        <CheckCircle size={24} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Form */}
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <UserCircle size={24} className="text-[#2b2c6c]" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={input.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[#e6317d] text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <PhoneCall size={24} className="text-[#2b2c6c]" />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          value={input.phone}
                          onChange={handleChange}
                          required
                          placeholder="Enter your phone number"
                          className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[#e6317d] text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        NIC
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <IdCard size={24} className="text-[#2b2c6c]" />
                        </div>
                        <input
                          type="text"
                          name="nic"
                          value={input.nic}
                          onChange={handleChange}
                          required
                          placeholder="Enter your NIC"
                          className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                        />
                      </div>
                      {errors.nic && (
                        <p className="text-[#e6317d] text-xs mt-1">
                          {errors.nic}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail size={24} className="text-[#2b2c6c]" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={input.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[#e6317d] text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Address{" "}
                        <span className="text-xs text-gray-500">
                          (max 30 characters)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                          <MapPin size={24} className="text-[#2b2c6c]" />
                        </div>
                        <textarea
                          name="address"
                          value={input.address}
                          onChange={handleChange}
                          required
                          maxLength={30}
                          placeholder="Enter your address (max 30 characters)"
                          className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent h-12 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                          {input.address.length}/30
                        </div>
                      </div>
                      {errors.address && (
                        <p className="text-[#e6317d] text-xs mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    
                    <div className="md:col-span-2 mt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-2.5 bg-[#828487] hover:bg-[#71717d] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center"
                        style={{ borderRadius: "7px" }}
                      >
                        <ChevronLeft size={24} className="mr-1" />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-[#e6317d] hover:bg-[#2b2c6c] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center"
                        style={{ borderRadius: "7px" }}
                      >
                        Book Appointment
                        <CheckCircle size={24} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

         
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border-l-4 border-[#2fb297] flex items-start">
            <div className="mr-3 text-[#2fb297] mt-1">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-[#2b2c6c] font-medium text-sm">
                Important Information
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Please arrive 15 minutes before your appointment time. Bring
                your ID and insurance information if applicable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookAppointment;