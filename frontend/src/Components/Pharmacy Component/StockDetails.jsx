import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react';

function StockDetails({ stockItems, onDelete, onUpdateClick }) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md">
      <div className="bg-[#2fb297] text-white px-6 py-4">
        <h2 className="text-xl font-bold">Stock Inventory</h2>
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
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stockItems.map((item) => (
              <>
                <tr 
                  key={item._id} 
                  className="transition-all hover:bg-gray-50"
                >
                  {/* Expansion Toggle */}
                  <td className="w-12 px-4 py-4">
                    <button 
                      onClick={() => toggleRowExpansion(item._id)}
                      className="text-[#71717d] hover:text-[#2b2c6c]"
                    >
                      {expandedRows[item._id] ? <ChevronDown /> : <ChevronRight />}
                    </button>
                  </td>

                  {/* Main Row Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs text-[#2b2c6c] bg-[#2b2c6c]/10 rounded-full">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.quantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.quantity}
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
                    <td colSpan="6" className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-[#71717d]">Expiration Date:</span>
                          <p>{new Date(item.expireDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-[#71717d]">Batch Number:</span>
                          <p>{item.batchNo}</p>
                        </div>
                        <div>
                          <span className="font-medium text-[#71717d]">Pack Size:</span>
                          <p>{item.packSize}</p>
                        </div>
                        <div className="col-span-3">
                          <span className="font-medium text-[#71717d]">Location:</span>
                          <p>{item.location}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockDetails;