import React, { useState, useEffect } from 'react';

function UpdateStock({ stock, onUpdateStock, onCancel }) {
  const [updatedStock, setUpdatedStock] = useState({ ...stock });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    type: "",
    company: "",
    quantity: "",
    expireDate: "",
    batchNo: "",
    packSize: "",
    location: ""
  });

  useEffect(() => {
    setUpdatedStock({ ...stock });
  }, [stock]);

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
    if (packSize > 10000) return "Cannot exceed 10000";
    return "";
  };

  const validateLocation = (location) => {
    if (!location.trim()) return "Location is required";
    if (location.length !== 3) return "Location must be exactly 3 characters";
    if (!/^[a-z]\d{2}$/.test(location))
      return "Should start with any lowercase letter (a-z) followed by 2 digits (e.g., b45, x12)";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStock({ ...updatedStock, [name]: value });
    // Clear error when user starts typing
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {
      name: validateName(updatedStock.name),
      type: validateType(updatedStock.type),
      company: validateCompany(updatedStock.company),
      quantity: validateQuantity(updatedStock.quantity),
      expireDate: validateExpireDate(updatedStock.expireDate),
      batchNo: validateBatchNo(updatedStock.batchNo),
      packSize: validatePackSize(updatedStock.packSize),
      location: validateLocation(updatedStock.location)
    };
    
    setFieldErrors(errors);
    
    return !Object.values(errors).some(error => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdateStock(updatedStock);
    }
  };

  const medicineTypes = [
    'Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 
    'Cream', 'Gel', 'Lotion', 'Drops', 'Suppository', 
    'Powder', 'Inhaler'
  ];

  return (
    <div className="max-w-4xl mx-auto overflow-hidden bg-white shadow-lg rounded-2xl">
      <div className="bg-[#2b2c6c] text-white px-6 py-4">
        <h2 className="text-xl font-bold">Update Stock Item</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Medicine Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#71717d] mb-2 font-medium">Medicine Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedStock.name}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, name: validateName(updatedStock.name)})}
              required
              className={`p-3 border ${
                fieldErrors.name ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter medicine name"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label htmlFor="type" className="text-[#71717d] mb-2 font-medium">Type</label>
            <select
              id="type"
              name="type"
              value={updatedStock.type}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, type: validateType(updatedStock.type)})}
              required
              className={`p-3 border ${
                fieldErrors.type ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
            >
              <option value="">Select Type</option>
              {medicineTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {fieldErrors.type && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.type}</p>
            )}
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <label htmlFor="company" className="text-[#71717d] mb-2 font-medium">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={updatedStock.company}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, company: validateCompany(updatedStock.company)})}
              required
              className={`p-3 border ${
                fieldErrors.company ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter company name"
            />
            {fieldErrors.company && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.company}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label htmlFor="quantity" className="text-[#71717d] mb-2 font-medium">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={updatedStock.quantity}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, quantity: validateQuantity(updatedStock.quantity)})}
              required
              min="0"
              className={`p-3 border ${
                fieldErrors.quantity ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter quantity"
            />
            {fieldErrors.quantity && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.quantity}</p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col">
            <label htmlFor="expireDate" className="text-[#71717d] mb-2 font-medium">Expiration Date</label>
            <input
              type="date"
              id="expireDate"
              name="expireDate"
              value={updatedStock.expireDate}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, expireDate: validateExpireDate(updatedStock.expireDate)})}
              required
              className={`p-3 border ${
                fieldErrors.expireDate ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
            />
            {fieldErrors.expireDate && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.expireDate}</p>
            )}
          </div>

          {/* Batch Number */}
          <div className="flex flex-col">
            <label htmlFor="batchNo" className="text-[#71717d] mb-2 font-medium">Batch Number</label>
            <input
              type="text"
              id="batchNo"
              name="batchNo"
              value={updatedStock.batchNo}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, batchNo: validateBatchNo(updatedStock.batchNo)})}
              required
              className={`p-3 border ${
                fieldErrors.batchNo ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter batch number"
            />
            {fieldErrors.batchNo && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.batchNo}</p>
            )}
          </div>

          {/* Pack Size */}
          <div className="flex flex-col">
            <label htmlFor="packSize" className="text-[#71717d] mb-2 font-medium">Pack Size</label>
            <input
              type="number"
              id="packSize"
              name="packSize"
              value={updatedStock.packSize}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, packSize: validatePackSize(updatedStock.packSize)})}
              required
              min="1"
              className={`p-3 border ${
                fieldErrors.packSize ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter pack size"
            />
            {fieldErrors.packSize && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.packSize}</p>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label htmlFor="location" className="text-[#71717d] mb-2 font-medium">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={updatedStock.location}
              onChange={handleChange}
              onBlur={() => setFieldErrors({...fieldErrors, location: validateLocation(updatedStock.location)})}
              required
              className={`p-3 border ${
                fieldErrors.location ? "border-red-500" : "border-[#828487]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all`}
              placeholder="Enter storage location"
            />
            {fieldErrors.location && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-3 text-[#2b2c6c] border border-[#2b2c6c] rounded-lg hover:bg-[#2b2c6c] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 text-white bg-[#2fb297] rounded-lg hover:bg-[#2fb297] hover:shadow-lg transition-all"
          >
            Update Stock
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateStock;