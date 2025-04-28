import React, { useState } from "react";
import axios from "axios";
import PAdminLayout from "./PAdminLayout";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

function StockAdding() {
  const [currentSection, setCurrentSection] = useState(1);
  const [stockData, setStockData] = useState({
    name: "",
    type: "",
    company: "",
    quantity: 0,
    expireDate: "",
    batchNo: "",
    packSize: 0,
    location: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    type: "",
    company: "",
    quantity: "",
    expireDate: "",
    batchNo: "",
    packSize: "",
    location: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData({ ...stockData, [name]: value });
    // Clear error when user starts typing
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };
  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Medicine name is required";
    if (name.trim().length < 2) return "At least 2 characters required";
    if (/[$#&*!@%^+=|\\/<>?~`]/.test(name))
      return "Characters like $, #, &, *, !, @, etc. are not allowed";
    return "";
  };

  const validateType = (type) => {
    if (!type) return "Type is required";
    return "";
  };

  const validateCompany = (company) => {
    if (!company.trim()) return "Company name is required";
    if (company.trim().length < 2) return "At least 2 characters required";
    if (!/^[a-zA-Z\s]+$/.test(company))
      return "No special characters or numbers allowed";
    return "";
  };

  const validateQuantity = (quantity) => {
    if (!quantity) return "Quantity is required";
    if (isNaN(quantity) || quantity <= 0) return "Must be a positive integer";
    return "";
  };

  const validateExpireDate = (date) => {
    if (!date) return "Expiration date is required";
    if (new Date(date) <= new Date()) return "Must be a future date";
    return "";
  };

  const validateBatchNo = (batchNo) => {
    if (!batchNo.trim()) return "Batch number is required";
    if (batchNo.length !== 4)
      return "Batch number must be exactly 4 characters";
    if (!/^[A-Z]\d{3}$/.test(batchNo))
      return "Should start with a capital letter (A-Z) followed by 3 digits (e.g., B123, X456)";
    return "";
  };
  const validatePackSize = (packSize) => {
    if (!packSize) return "Pack size is required";
    if (isNaN(packSize)) return "Must be a number";
    if (packSize <= 0) return "Must be positive";
    if (packSize > 1000) return "Cannot exceed 1000";
    return "";
  };

  const validateLocation = (location) => {
    if (!location.trim()) return "Location is required";
    if (location.length !== 3) return "Location must be exactly 3 characters";
    if (!/^[a-z]\d{2}$/.test(location))
      return "Should start with any lowercase letter (a-z) followed by 2 digits (e.g., b45, x12)";
    return "";
  };
  // Validate first section
  const validateFirstSection = () => {
    const errors = {
      name: validateName(stockData.name),
      type: validateType(stockData.type),
      company: validateCompany(stockData.company),
    };
    return {
      isValid: !errors.name && !errors.type && !errors.company,
      errors,
    };
  };

  // Validate second section
  const validateSecondSection = () => {
    const errors = {
      quantity: validateQuantity(stockData.quantity),
      expireDate: validateExpireDate(stockData.expireDate),
      batchNo: validateBatchNo(stockData.batchNo),
      packSize: validatePackSize(stockData.packSize),
      location: validateLocation(stockData.location),
    };
    return {
      isValid:
        !errors.quantity &&
        !errors.expireDate &&
        !errors.batchNo &&
        !errors.packSize &&
        !errors.location,
      errors,
    };
  };

  const handleNextSection = () => {
    const { isValid, errors } = validateFirstSection();
    setFieldErrors(errors);
    if (isValid) setCurrentSection(2);
  };

  const handlePrevSection = () => {
    setCurrentSection(1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstValidation = validateFirstSection();
    const secondValidation = validateSecondSection();

    setFieldErrors({
      ...firstValidation.errors,
      ...secondValidation.errors,
    });

    if (firstValidation.isValid && secondValidation.isValid) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/stock",
          stockData
        );
        console.log("Stock added:", response.data);
        alert("Stock added successfully");
        setStockData({
          name: "",
          type: "",
          company: "",
          quantity: 0,
          expireDate: "",
          batchNo: "",
          packSize: 0,
          location: "",
        });
        setCurrentSection(1);
        setFieldErrors({
          name: "",
          type: "",
          company: "",
          quantity: "",
          expireDate: "",
          batchNo: "",
          packSize: "",
          location: "",
        });
        setError("");
      } catch (err) {
        console.error("Error adding stock:", err);
        setError("Failed to add stock");
      }
    } else {
      setError("Please fix the errors before submitting");
    }
  };

  return (
    <PAdminLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-96px)] p-6">
        <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#2b2c6c] text-white">
            <div
              className={`flex items-center ${
                currentSection === 1 ? "font-bold" : "opacity-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${
                  currentSection === 1
                    ? "bg-white text-[#2b2c6c]"
                    : "bg-[#828487]"
                }`}
              >
                1
              </div>
              Basic Details
            </div>
            <div className="w-1/3 h-1 bg-[#828487] mx-4"></div>
            <div
              className={`flex items-center ${
                currentSection === 2 ? "font-bold" : "opacity-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${
                  currentSection === 2
                    ? "bg-white text-[#2b2c6c]"
                    : "bg-[#828487]"
                }`}
              >
                2
              </div>
              Stock Information
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* First Section */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Medicine Name */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-[#71717d] mb-2">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={stockData.name}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter medicine name"
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="flex flex-col">
                    <label htmlFor="type" className="text-[#71717d] mb-2">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={stockData.type}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                    >
                      <option value="">Select Type</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Cream">Cream</option>
                      <option value="Gel">Gel</option>
                      <option value="Lotion">Lotion</option>
                      <option value="Drops">Drops</option>
                      <option value="Suppository">Suppository</option>
                      <option value="Powder">Powder</option>
                      <option value="Inhaler">Inhaler</option>
                    </select>
                    {fieldErrors.type && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.type}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="flex flex-col">
                    <label htmlFor="company" className="text-[#71717d] mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={stockData.company}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter company name"
                    />
                    {fieldErrors.company && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      validateFirstSection() && setCurrentSection(2)
                    }
                    className={`flex items-center px-6 py-3 rounded-lg text-white transition-all 
                      ${
                        validateFirstSection()
                          ? "bg-[#2fb297] hover:bg-[#2fb297] hover:shadow-lg"
                          : "bg-[#828487] cursor-not-allowed"
                      }`}
                    disabled={!validateFirstSection()}
                  >
                    Next Section <ChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Second Section */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Quantity */}
                  <div className="flex flex-col">
                    <label htmlFor="quantity" className="text-[#71717d] mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={stockData.quantity}
                      onChange={handleChange}
                      onBlur={() =>
                        setFieldErrors({
                          ...fieldErrors,
                          quantity: validateQuantity(stockData.quantity),
                        })
                      }
                      className={`p-3 border ${
                        fieldErrors.quantity
                          ? "border-red-500"
                          : "border-[#828487]"
                      } rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all`}
                      placeholder="Enter quantity"
                    />
                    {fieldErrors.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Expiration Date */}
                  <div className="flex flex-col">
                    <label htmlFor="expireDate" className="text-[#71717d] mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      id="expireDate"
                      name="expireDate"
                      value={stockData.expireDate}
                      onChange={handleChange}
                      onBlur={() =>
                        setFieldErrors({
                          ...fieldErrors,
                          expireDate: validateExpireDate(stockData.expireDate),
                        })
                      }
                      className={`p-3 border ${
                        fieldErrors.expireDate
                          ? "border-red-500"
                          : "border-[#828487]"
                      } rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all`}
                    />
                    {fieldErrors.expireDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.expireDate}
                      </p>
                    )}
                  </div>

                  {/* Batch No */}
                  <div className="flex flex-col">
                    <label htmlFor="batchNo" className="text-[#71717d] mb-2">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      id="batchNo"
                      name="batchNo"
                      value={stockData.batchNo}
                      onChange={handleChange}
                      onBlur={() =>
                        setFieldErrors({
                          ...fieldErrors,
                          batchNo: validateBatchNo(stockData.batchNo),
                        })
                      }
                      className={`p-3 border ${
                        fieldErrors.batchNo
                          ? "border-red-500"
                          : "border-[#828487]"
                      } rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all`}
                      placeholder="Enter batch number"
                    />
                    {fieldErrors.batchNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.batchNo}
                      </p>
                    )}
                  </div>

                  {/* Pack Size */}
                  <div className="flex flex-col">
                    <label htmlFor="packSize" className="text-[#71717d] mb-2">
                      Pack Size
                    </label>
                    <input
                      type="number"
                      id="packSize"
                      name="packSize"
                      value={stockData.packSize}
                      onChange={handleChange}
                      onBlur={() =>
                        setFieldErrors({
                          ...fieldErrors,
                          packSize: validatePackSize(stockData.packSize),
                        })
                      }
                      className={`p-3 border ${
                        fieldErrors.packSize
                          ? "border-red-500"
                          : "border-[#828487]"
                      } rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all`}
                      placeholder="Enter pack size"
                    />
                    {fieldErrors.packSize && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.packSize}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex flex-col col-span-2">
                    <label htmlFor="location" className="text-[#71717d] mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={stockData.location}
                      onChange={handleChange}
                      onBlur={() =>
                        setFieldErrors({
                          ...fieldErrors,
                          location: validateLocation(stockData.location),
                        })
                      }
                      className={`p-3 border ${
                        fieldErrors.location
                          ? "border-red-500"
                          : "border-[#828487]"
                      } rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all`}
                      placeholder="Enter storage location"
                    />
                    {fieldErrors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentSection(1)}
                    className="flex items-center px-6 py-3 rounded-lg text-[#2b2c6c] border border-[#2b2c6c] hover:bg-[#2b2c6c] hover:text-white transition-all"
                  >
                    <ChevronLeft className="mr-2" /> Previous Section
                  </button>

                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 rounded-lg text-white bg-[#2fb297] hover:bg-[#2fb297] hover:shadow-lg transition-all"
                  >
                    <Check className="mr-2" /> Add Stock
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center text-red-500">{error}</div>
            )}
          </form>
        </div>
      </div>
    </PAdminLayout>
  );
}

export default StockAdding;
