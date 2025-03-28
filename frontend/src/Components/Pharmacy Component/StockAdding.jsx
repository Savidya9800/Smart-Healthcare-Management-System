import React, { useState } from "react";
import axios from "axios";
import PAdminLayout from "./PAdminLayout";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

function StockAdding() {
  const [currentSection, setCurrentSection] = useState(1);
  const [stockData, setStockData] = useState({
    name: '',
    type: '',
    company: '',
    quantity: 0,
    expireDate: '',
    batchNo: '',
    packSize: 0,
    location: ''
  });

  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData({ ...stockData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/stock", stockData);
      console.log("Stock added:", response.data);
      alert("Stock added successfully");
      setStockData({
        name: '',
        type: '',
        company: '',
        quantity: 0,
        expireDate: '',
        batchNo: '',
        packSize: 0,
        location: ''
      });
      setCurrentSection(1);
    } catch (err) {
      console.error("Error adding stock:", err);
      setError("Failed to add stock");
    }
  };

  // Validation for first section
  const validateFirstSection = () => {
    return stockData.name.trim() !== '' && 
           stockData.type.trim() !== '' && 
           stockData.company.trim() !== '';
  };

  return (
    <PAdminLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-96px)] p-6">
        <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#2b2c6c] text-white">
            <div 
              className={`flex items-center ${currentSection === 1 ? 'font-bold' : 'opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${currentSection === 1 ? 'bg-white text-[#2b2c6c]' : 'bg-[#828487]'}`}>
                1
              </div>
              Basic Details
            </div>
            <div className="w-1/3 h-1 bg-[#828487] mx-4"></div>
            <div 
              className={`flex items-center ${currentSection === 2 ? 'font-bold' : 'opacity-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                ${currentSection === 2 ? 'bg-white text-[#2b2c6c]' : 'bg-[#828487]'}`}>
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
                    <label htmlFor="name" className="text-[#71717d] mb-2">Medicine Name</label>
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
                  </div>

                  {/* Type */}
                  <div className="flex flex-col">
                    <label htmlFor="type" className="text-[#71717d] mb-2">Type</label>
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
                  </div>

                  {/* Company */}
                  <div className="flex flex-col">
                    <label htmlFor="company" className="text-[#71717d] mb-2">Company</label>
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
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => validateFirstSection() && setCurrentSection(2)}
                    className={`flex items-center px-6 py-3 rounded-lg text-white transition-all 
                      ${validateFirstSection() 
                        ? 'bg-[#2fb297] hover:bg-[#2fb297] hover:shadow-lg' 
                        : 'bg-[#828487] cursor-not-allowed'}`}
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
                    <label htmlFor="quantity" className="text-[#71717d] mb-2">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={stockData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter quantity"
                    />
                  </div>

                  {/* Expiration Date */}
                  <div className="flex flex-col">
                    <label htmlFor="expireDate" className="text-[#71717d] mb-2">Expiration Date</label>
                    <input
                      type="date"
                      id="expireDate"
                      name="expireDate"
                      value={stockData.expireDate}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                    />
                  </div>

                  {/* Batch No */}
                  <div className="flex flex-col">
                    <label htmlFor="batchNo" className="text-[#71717d] mb-2">Batch Number</label>
                    <input
                      type="text"
                      id="batchNo"
                      name="batchNo"
                      value={stockData.batchNo}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter batch number"
                    />
                  </div>

                  {/* Pack Size */}
                  <div className="flex flex-col">
                    <label htmlFor="packSize" className="text-[#71717d] mb-2">Pack Size</label>
                    <input
                      type="number"
                      id="packSize"
                      name="packSize"
                      value={stockData.packSize}
                      onChange={handleChange}
                      required
                      min="1"
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter pack size"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col col-span-2">
                    <label htmlFor="location" className="text-[#71717d] mb-2">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={stockData.location}
                      onChange={handleChange}
                      required
                      className="p-3 border border-[#828487] rounded-lg focus:ring-2 focus:ring-[#2fb297] transition-all"
                      placeholder="Enter storage location"
                    />
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
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
          </form>
        </div>
      </div>
    </PAdminLayout>
  );
}

export default StockAdding;