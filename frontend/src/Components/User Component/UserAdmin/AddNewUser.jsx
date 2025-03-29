import React, { useState } from "react";
import axios from "axios";
import UAdminLayout from "./UAdminLayout"; // Import UAdminLayout

function AddNewPatient({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    bloodGroup: "Not Specified",
    country: "",
    city: "",
    gender: "Not Specified",
    dateOfBirth: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Add current date as registration date
      const dataToSubmit = {
        ...formData,
        regDate: new Date().toISOString().split("T")[0],
      };

      // Send POST request to the register API
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        dataToSubmit
      );
      console.log(response.data);
      alert("Patient registered successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UAdminLayout>
      <div className="bg-white rounded-lg">
        {error && (
          <div className="p-3 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-white ${
                  step >= 1 ? "bg-[#2fb297]" : "bg-[#71717d]"
                }`}
              >
                1
              </div>
              <div className="ml-3">
                <p
                  className={`font-medium ${
                    step === 1 ? "text-[#2b2c6c]" : "text-[#71717d]"
                  }`}
                >
                  Personal Information
                </p>
              </div>
            </div>

            <div className="flex-grow mx-4">
              <div
                className={`h-1 rounded-full ${
                  step >= 2 ? "bg-[#2fb297]" : "bg-gray-200"
                }`}
              ></div>
            </div>

            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-white ${
                  step >= 2 ? "bg-[#2fb297]" : "bg-[#71717d]"
                }`}
              >
                2
              </div>
              <div className="ml-3">
                <p
                  className={`font-medium ${
                    step === 2 ? "text-[#2b2c6c]" : "text-[#71717d]"
                  }`}
                >
                  Additional Details
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="name"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="email"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="password"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="mobile"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="gender"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end mt-6 md:col-span-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#2fb297] text-white rounded-lg hover:bg-[#28a68b] transition-colors font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <span>Next Step</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="bloodGroup"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="country"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-[1.02]">
                <label
                  htmlFor="city"
                  className="block text-[#71717d] mb-2 text-sm font-medium"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297]"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-between mt-6 md:col-span-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-[#71717d] text-white rounded-lg hover:bg-[#828487] transition-colors font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Previous Section</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2fb297] text-white rounded-lg hover:bg-[#28a68b] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Register Patient</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </UAdminLayout>
  );
}

export default AddNewPatient;
