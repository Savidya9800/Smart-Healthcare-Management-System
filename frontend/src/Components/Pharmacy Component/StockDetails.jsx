import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Search, PlusCircle } from 'lucide-react';

function StockDetails({ stockItems, onDelete, onUpdateClick }) {
  const [expandedRows, setExpandedRows] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Enhanced filtering based on active tab and search term
  const filteredItems = stockItems.filter(item => {
    // Search filtering across name, company, and type
    const matchesSearch = 
      searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filtering
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'low' && item.quantity < 10) return matchesSearch;
    if (activeTab === 'expiringSoon') {
      // Calculate if medicine expires within 60 days
      const today = new Date();
      const expiryDate = new Date(item.expireDate);
      const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 60 && matchesSearch;
    }
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header Section - Removed */}
      
      {/* Search Bar - Simplified and enhanced */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-[#71717d]" />
        </div>
        <input
          type="text"
          placeholder="Search by name, company or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2b2c6c]/20"
        />
      </div>
      
      {/* Tabs - Updated with only three tabs */}
      <div className="flex overflow-x-auto border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'all' 
              ? 'border-[#2fb297] text-[#2fb297]' 
              : 'border-transparent text-[#71717d] hover:text-[#2b2c6c]'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveTab('low')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'low' 
              ? 'border-[#e6317d] text-[#e6317d]' 
              : 'border-transparent text-[#71717d] hover:text-[#2b2c6c]'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setActiveTab('expiringSoon')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'expiringSoon' 
              ? 'border-[#ff9800] text-[#ff9800]' 
              : 'border-transparent text-[#71717d] hover:text-[#2b2c6c]'
          }`}
        >
          Expiring Soon
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="bg-[#2fb297] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Stock Inventory</h2>
          <span className="px-3 py-1 text-xs font-medium bg-white rounded-full text-[#2fb297]">
            {filteredItems.length} items
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-[#71717d]">
                <th className="w-12 px-4 py-3"></th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Type</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Company</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Expiry</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  // Calculate days until expiry for visual indicators
                  const today = new Date();
                  const expiryDate = new Date(item.expireDate);
                  const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <React.Fragment key={item._id}>
                      <tr className="transition-all hover:bg-gray-50">
                        {/* Expansion Toggle */}
                        <td className="w-12 px-4 py-4">
                          <button 
                            onClick={() => toggleRowExpansion(item._id)}
                            className="text-[#71717d] hover:text-[#2b2c6c]"
                          >
                            {expandedRows[item._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </button>
                        </td>

                        {/* Main Row Details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium text-[#2b2c6c] bg-[#2b2c6c]/10 rounded-full">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            item.quantity < 10 
                              ? 'bg-red-100 text-red-800' 
                              : item.quantity < 20
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {item.quantity}
                          </span>
                        </td>
                        
                        {/* Expiry date with visual indicator */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            daysUntilExpiry <= 30 
                              ? 'bg-red-100 text-red-800' 
                              : daysUntilExpiry <= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {new Date(item.expireDate).toLocaleDateString()}
                          </span>
                        </td>
                        
                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => onUpdateClick(item)}
                              className="text-[#2b2c6c] hover:bg-[#2b2c6c]/10 p-2 rounded-full transition-all"
                              title="Update"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => onDelete(item._id)}
                              className="text-[#e6317d] hover:bg-[#e6317d]/10 p-2 rounded-full transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows[item._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-white md:grid-cols-3">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium uppercase text-[#71717d]">Expiration Date</span>
                                <p className="mt-1 font-medium">{new Date(item.expireDate).toLocaleDateString()}</p>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium uppercase text-[#71717d]">Batch Number</span>
                                <p className="mt-1 font-medium">{item.batchNo}</p>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium uppercase text-[#71717d]">Pack Size</span>
                                <p className="mt-1 font-medium">{item.packSize}</p>
                              </div>
                              <div className="flex flex-col md:col-span-3">
                                <span className="text-xs font-medium uppercase text-[#71717d]">Location</span>
                                <p className="mt-1 font-medium">{item.location}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    No stock items found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;