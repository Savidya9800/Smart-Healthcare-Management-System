import React, { useState } from "react";
import axios from "axios";
import UAdminLayout from "./UAdminLayout";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Droplet,
  Users,
  ChevronRight,
  ChevronLeft,
  Save,
} from "lucide-react";

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

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let message = "";
    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format.";
    }
    if (name === "mobile" && value) {
      const phoneRegex = /^07[0-9]{8}$/;
      if (!phoneRegex.test(value))
        message = "Mobile must be 10 digits starting with 07.";
    }
    if (name === "dateOfBirth" && value) {
      const selectedDate = new Date(value);
      const now = new Date();
      if (selectedDate > now)
        message = "Date of birth cannot be in the future.";
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleNext = () => setStep(2);
  const handlePrevious = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Ensure all fields are validated before submission
    let valid = true;
    const validationErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        valid = false;
        validationErrors[field] = errors[field];
      }
    });

    if (!valid) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        regDate: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        dataToSubmit
      );
      alert("Patient registered successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass =
    "w-full pl-11 pr-4 py-[14px] rounded-lg border focus:outline-none transition duration-150 ease-in-out";
  const errorClass = "border-red-500 focus:ring-red-300";
  const normalClass = "border-gray-200 focus:ring-2 focus:ring-[#2fb297]";

  const renderError = (field) =>
    errors[field] && (
      <p className="mt-1 ml-1 text-sm text-red-600">{errors[field]}</p>
    );

  return (
    <UAdminLayout>
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="p-3 mb-6 text-red-600 border border-red-200 rounded-lg shadow-sm bg-red-50">
            {error}
          </div>
        )}

        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          {/* Progress Header */}
          <div className="bg-[#2b2c6c] p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white border-2 ${
                    step >= 1
                      ? "bg-[#2fb297] border-[#2fb297]"
                      : "bg-[#71717d] border-[#71717d]"
                  }`}
                >
                  <span>1</span>
                </div>
                <span className="font-medium">Basic Details</span>
              </div>

              <div className="flex-grow mx-6">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full bg-[#2fb297]"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white border-2 ${
                    step >= 2
                      ? "bg-[#2fb297] border-[#2fb297]"
                      : "bg-[#71717d] border-[#71717d]"
                  }`}
                >
                  <span>2</span>
                </div>
                <span className="font-medium">Additional Info</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Details Step */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  {
                    name: "name",
                    label: "Patient Name",
                    type: "text",
                    icon: <User size={18} />,
                    placeholder: "Enter patient name",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                    type: "email",
                    icon: <Mail size={18} />,
                    placeholder: "patient@example.com",
                  },
                  {
                    name: "password",
                    label: "Password",
                    type: "password",
                    icon: <Lock size={18} />,
                    placeholder: "••••••••",
                  },
                  {
                    name: "mobile",
                    label: "Mobile Number",
                    type: "text",
                    icon: <Phone size={18} />,
                    placeholder: "0712345678",
                  },
                ].map(({ name, label, type, icon, placeholder }) => (
                  <div className="relative" key={name}>
                    <label
                      htmlFor={name}
                      className="block text-[#71717d] mb-2 text-sm font-medium"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#71717d]">
                        {icon}
                      </span>
                      <input
                        type={type}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className={`${inputBaseClass} ${
                          errors[name] ? errorClass : normalClass
                        } placeholder-gray-400`}
                      />
                    </div>
                    {renderError(name)}
                  </div>
                ))}

                <div className="relative">
                  <label className="block text-[#71717d] mb-2 text-sm font-medium">
                    Gender
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#71717d]">
                      <Users size={18} />
                    </span>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`${inputBaseClass} ${
                        errors.gender ? errorClass : normalClass
                      } text-gray-700 bg-white pr-8`}
                    >
                      <option value="Not Specified">Not Specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#71717d]">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[#71717d] mb-2 text-sm font-medium">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#71717d]">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`${inputBaseClass} ${
                        errors.dateOfBirth ? errorClass : normalClass
                      } text-gray-700`}
                    />
                  </div>
                  {renderError("dateOfBirth")}
                </div>
              </div>
            )}

            {/* Additional Info Step */}
            {step === 2 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  {
                    name: "bloodGroup",
                    label: "Blood Group",
                    icon: <Droplet size={18} />,
                    type: "select",
                    options: [
                      "Not Specified",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "O+",
                      "O-",
                      "AB+",
                      "AB-",
                    ],
                  },
                  {
                    name: "country",
                    label: "Country",
                    icon: <Globe size={18} />,
                    type: "text",
                    placeholder: "Enter country",
                  },
                  {
                    name: "city",
                    label: "City",
                    icon: <MapPin size={18} />,
                    type: "text",
                    placeholder: "Enter city",
                  },
                ].map((field) => (
                  <div className="relative" key={field.name}>
                    <label className="block text-[#71717d] mb-2 text-sm font-medium">
                      {field.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#71717d]">
                        {field.icon}
                      </span>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className={`${inputBaseClass} ${normalClass} pr-8 text-gray-700 bg-white`}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className={`${inputBaseClass} ${normalClass} placeholder-gray-400`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-[#71717d] text-white rounded-lg hover:bg-[#828487] transition-colors font-medium shadow hover:shadow-md flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#2fb297] text-white rounded-lg hover:bg-[#28a68b] transition-colors font-medium shadow hover:shadow-md flex items-center gap-2"
                >
                  <span>Next Section</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2fb297] text-white rounded-lg hover:bg-[#28a68b] transition-colors font-medium shadow hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Register Patient</span>
                      <Save size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </UAdminLayout>
  );
}

export default AddNewPatient;
