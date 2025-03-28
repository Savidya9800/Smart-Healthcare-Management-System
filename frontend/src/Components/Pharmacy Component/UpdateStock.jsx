import React, { useState, useEffect } from 'react';

function UpdateStock({ stock, onUpdateStock, onCancel }) {
  const [updatedStock, setUpdatedStock] = useState({ ...stock });

  useEffect(() => {
    setUpdatedStock({ ...stock });
  }, [stock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStock({ ...updatedStock, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStock(updatedStock);
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
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter medicine name"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label htmlFor="type" className="text-[#71717d] mb-2 font-medium">Type</label>
            <select
              id="type"
              name="type"
              value={updatedStock.type}
              onChange={handleChange}
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
            >
              <option value="">Select Type</option>
              {medicineTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter company name"
            />
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
              required
              min="0"
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter quantity"
            />
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
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
            />
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
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter batch number"
            />
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
              required
              min="1"
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter pack size"
            />
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
              required
              className="p-3 border border-[#828487] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fb297] transition-all"
              placeholder="Enter storage location"
            />
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