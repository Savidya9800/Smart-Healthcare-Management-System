import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";
import { Link } from "react-router-dom";

function AnalysisHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/analysis/my-analyses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching analysis history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Navigation functions
  const nextPage = () => {
    if (currentPage < Math.ceil(records.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div className="min-h-screen p-8 bg-white">
      {/* Navigation Bar - Matching the style from your image */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="flex">
          <div className="w-3/4 bg-[#2b2c6c] flex items-center h-[50px]">
            <Link
              to="/Find-doctor"
              className="ml-[110px] text-white text-xl font-semibold relative group hover:text-[#28b6a2] transition-colors duration-300 cursor-pointer"
            >
              FIND A DOCTOR
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#28b6a2] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              to="/online-results"
              className="ml-[180px] text-white text-xl font-semibold relative group hover:text-[#28b6a2] transition-colors duration-300 cursor-pointer"
            >
              ONLINE RESULTS
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#28b6a2] transition-all duration-300 group-hover:w-full" />
            </Link>

            <Link
              to="/Book-Appointment"
              className="ml-[180px] text-white text-xl font-semibold relative group hover:text-[#28b6a2] transition-colors duration-300 cursor-pointer"
            >
              BOOK AN APPOINTMENT
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#28b6a2] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="w-1/4 bg-[#2FB297] flex items-center justify-center h-[50px]">
            <Link
              to="/request-consultation"
              className="relative px-4 py-2 text-xl font-semibold text-white transition-all duration-300 cursor-pointer hover:text-white hover:brightness-110"
            >
              REQUEST A CONSULTATION
            </Link>
          </div>
        </div>

        {/* Logo and Main Menu */}
        <div className="bg-white shadow-md h-[70px] flex items-center">
          <div className="flex items-center ml-[60px]">
            <Link to="/Home" className="flex items-center cursor-pointer">
              <img src="/Logo.png" alt="Logo" className="h-[60px]" />
              <div className="text-[#2b2c6c] ml-2 font-bold text-lg">
                MEDI FLOW
                <div className="text-xs">HEALTH AND WELLNESS CARE</div>
              </div>
            </Link>
          </div>

          <div className="ml-auto mr-[50px] flex space-x-10 font-semibold">
            {[
              { name: "Home", path: "/Home" },
              { name: "Contact Us", path: "/Contact-Us" },
              { name: "Our Facilities", path: "/Our-Facilities" },
              { name: "About Us", path: "/About-Us" },
              { name: "My Account", path: "/User-Account" }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="relative py-2 text-black hover:text-[#e6317d] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#e6317d] after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[130px]"></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <TimelineIcon style={{ color: "#e6317d", fontSize: 32, marginRight: 12 }} />
            <Typography 
              variant="h4" 
              style={{ 
                color: "#2b2c6c", 
                fontWeight: 600,
              }}
            >
              Health Trends - Symptom Analysis History
            </Typography>
          </div>
          
          <button 
            className="bg-[#2b2c6c] hover:bg-[#3a3b8a] text-white py-2 px-4 rounded-md flex items-center shadow-md transition duration-300"
          >
            <DownloadIcon style={{ marginRight: 8 }} />
            EXPORT REPORT
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-[#71717d] mr-2">Time Range:</span>
            <div className="border border-gray-300 rounded-md p-2 flex items-center cursor-pointer hover:border-[#2FB297]">
              <span className="mr-2">Last 7 Days</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Pagination Display */}
          {!loading && records.length > 0 && (
            <div className="flex items-center text-[#71717d]">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center mt-20">
            <CircularProgress style={{ color: "#e6317d" }} size={60} thickness={5} />
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center border border-gray-200 shadow-sm bg-gray-50 rounded-xl">
            <TimelineIcon style={{ color: "#e6317d", fontSize: 80, opacity: 0.7 }} />
            <Typography 
              variant="h5" 
              style={{ color: "#71717d", marginTop: 24 }}
            >
              No analysis history found yet.
            </Typography>
            <Typography 
              style={{ color: "#828487", marginTop: 12 }}
            >
              Your symptom analysis results will appear here once completed.
            </Typography>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {currentRecords.map((record) => (
                <div 
                  key={record._id}
                  className="overflow-hidden transition duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl"
                >
                  <div className="relative">
                    <div className="h-1.5 bg-gradient-to-r from-[#2fb297] to-[#e6317d]"></div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <MedicalServicesIcon style={{ color: "#2fb297", marginRight: 10 }} />
                          <div className="text-xl font-bold text-[#2b2c6c]">
                            {record.prediction}
                          </div>
                        </div>
                        <div className="text-xs text-[#828487] bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(record.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {record.symptoms.map((symptom, index) => (
                          <Chip
                            key={index}
                            label={symptom}
                            style={{
                              backgroundColor: "#f0f0f0",
                              color: "#e6317d",
                              fontWeight: "500",
                              fontSize: "0.8rem",
                              border: "1px solid #e6317d40",
                              marginBottom: 4
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <button className="text-[#2b2c6c] hover:text-[#e6317d] font-medium transition duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {records.length > recordsPerPage && (
              <div className="flex justify-center mt-10 space-x-4">
                <Tooltip title={currentPage === 1 ? "First page" : "Previous page"}>
                  <IconButton 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    style={{ 
                      color: currentPage === 1 ? "#ccc" : "#2b2c6c",
                      backgroundColor: currentPage === 1 ? "#f5f5f5" : "#f0f0f0" 
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={currentPage === totalPages ? "Last page" : "Next page"}>
                  <IconButton 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    style={{ 
                      color: currentPage === totalPages ? "#ccc" : "#2b2c6c",
                      backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#f0f0f0" 
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnalysisHistory;