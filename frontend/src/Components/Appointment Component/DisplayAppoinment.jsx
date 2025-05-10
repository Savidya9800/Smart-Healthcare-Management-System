import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Nav from "../Nav Component/Nav";
import SectionHeader from "../Nav Component/SectionHeader";
import Logo22 from "../../Components/Appointment Component/images/Logo2.png";
import Footer from "../Nav Component/Footer";
import {
  PhoneCall,
  Mail,
  MapPin,
  UserCircle,
  Calendar,
  IdCard,
  Edit,
  Trash2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function DisplayAppointment() {
  const [patientDetails, setPatientDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nic: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }

    axios
      .get("http://localhost:5000/api/appoinment/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const lastAppointment =
          response.data.appoinments[response.data.appoinments.length - 1];
        setPatientDetails(lastAppointment);
        setFormData(lastAppointment);
      })
      .catch((error) => {
        console.error("Error fetching appointment details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch appointment details.",
        });
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name cannot contain numbers";
    }

    if (!/^0[1-9][0-9]{8}$/.test(formData.phone)) {
      tempErrors.phone = "Phone must start with 0 and be 10 digits";
    }

    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(formData.email)) {
      tempErrors.email = "Enter a valid email";
    }

    if (formData.nic && !/^[0-9]{11}[Vv]$|^[0-9]{12}$/.test(formData.nic)) {
      tempErrors.nic = "Invalid NIC (e.g., 12345678912V or 200012345678)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5000/api/appoinment/${patientDetails._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setPatientDetails(formData);
        setIsEditing(false);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "✅ Details Updated",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate("/Appoinment-Display");
      })
      .catch((error) => {
        console.error("Error updating appointment details:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.response?.data?.message || "Failed to update details.",
        });
      });
  };

  const handleConfirm = async () => {
    if (!patientDetails || !patientDetails._id) {
      setEmailStatus({
        success: false,
        message: "No appointment details available to send confirmation",
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/appoinment/send-confirmation",
        { appointmentId: patientDetails._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmailStatus({
        success: true,
        message: "Confirmation email sent successfully!",
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "✅ Email Sent",
        showConfirmButton: false,
        timer: 2500,
      });

      // Show PDF download prompt
      Swal.fire({
        title: "Download PDF",
        text: "Would you like to download your appointment details as a PDF?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2b2c6c",
        cancelButtonColor: "#e6317d",
        confirmButtonText: "Yes, Download",
        cancelButtonText: "No, Return Home",
      }).then((result) => {
        if (result.isConfirmed) {
          generatePDF(patientDetails);
        }
        navigate("/Home");
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      setEmailStatus({
        success: false,
        message:
          error.response?.data?.error ||
          "Failed to send confirmation email. Please try again later.",
      });
      Swal.fire({
        icon: "error",
        title: "Email Failed",
        text: error.response?.data?.error || "Failed to send confirmation email.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Cancel Appointment",
      text: "Are you sure you want to cancel this appointment? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e6317d",
      cancelButtonColor: "#828487",
      confirmButtonText: "Yes, Cancel Appointment",
      cancelButtonText: "No, Keep Appointment",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axios
          .delete(`http://localhost:5000/api/appoinment/${patientDetails._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "✅ Appointment Cancelled",
              showConfirmButton: false,
              timer: 2500,
            });
            navigate("/Home");
          })
          .catch((error) => {
            console.error("Error deleting appointment:", error);
            Swal.fire({
              icon: "error",
              title: "Cancellation Failed",
              text:
                error.response?.data?.message || "Failed to cancel appointment.",
            });
          });
      }
    });
  };

  // Generate and download PDF - Enhanced professional version
  const generatePDF = (item) => {
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Appointment-${item.name.replace(/\s+/g, "-")}`,
      subject: "Appointment Confirmation Details",
      author: "MediFlow Healthcare System",
      keywords: "appointment, healthcare, confirmation",
      creator: "MediFlow",
    });

    // Add watermark
    const addWatermark = (doc) => {
      const totalPages = doc.internal.getNumberOfPages();

      // Watermark text
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230); // Light gray
      doc.setFont("helvetica", "bold");

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Position watermark in center of page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set transparency
        doc.setGState(new doc.GState({ opacity: 0.2 }));

        // Add watermark with angle parameter
        doc.text("MEDIFLOW", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: -45,
        });
      }
    };

    // --- HEADER SECTION ---

    // Create top border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(0, 0, doc.internal.pageSize.width, 2, "F");

    // Add colored accent on left side
    doc.setFillColor(47, 178, 151); // #2fb297
    doc.rect(0, 2, 8, 40, "F");

    // Add logo
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage(Logo22, "PNG", 15, 5, logoWidth, logoHeight);

    // Add header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("MEDIFLOW", 15 + logoWidth + 5, 18);

    // Add sub-header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(47, 178, 151); // #2fb297 - Green color for emphasis
    doc.text("HEALTHCARE MANAGEMENT SYSTEM", 15 + logoWidth + 5, 26);

    // Add contact details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Medical Center Drive, Healthcare City", 15 + logoWidth + 5, 32);
    doc.text("Phone: (123) 456-7890 | Email: support@mediflow.com", 15 + logoWidth + 5, 36);
    doc.text("www.mediflow.com", 15 + logoWidth + 5, 40);

  
    // Add header line separator
    doc.setDrawColor(230, 230, 230);
    doc.line(15, 44, 185, 44);

    // Add appointment details box
    doc.setFillColor(245, 250, 250); // Light background
    doc.setDrawColor(47, 178, 151); // Green border
    doc.roundedRect(140, 10, 60, 30, 3, 3, "FD"); // Filled rectangle with rounded corners

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("APPOINTMENT", 170, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`ID: ${item.indexno || "N/A"}`, 170, 28, {
      align: "center",
    });

    // Add status box
    const status = "CONFIRMED";
    const statusColor = [47, 178, 151]; // Green for confirmed
    const statusWidth = 40;
    const statusX = 170 - statusWidth / 2;
    doc.setFillColor(...statusColor, 0.15); // Semi-transparent green
    doc.setDrawColor(...statusColor);
    doc.roundedRect(statusX, 31, statusWidth, 8, 2, 2, "FD");

    doc.setTextColor(...statusColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(status, 170, 36, { align: "center" });

    // Add divider below header
    doc.setDrawColor(230, 230, 230);
    doc.line(10, 50, 200, 50);

    // --- MAIN CONTENT SECTION ---

    // Appointment title
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Appointment Confirmation", 10, 65);

    // --- PATIENT INFO SECTION ---
    doc.setFillColor(240, 240, 250);
    doc.setDrawColor(220, 220, 240);
    doc.roundedRect(10, 80, 90, 90, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("PATIENT INFORMATION", 15, 90);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const patientInfo = [
      { label: "Full Name:", value: item.name || "N/A" },
      { label: "Phone:", value: item.phone || "N/A" },
      { label: "NIC:", value: item.nic || "N/A" },
      { label: "Email:", value: item.email || "N/A" },
      { label: "Address:", value: item.address || "N/A" },
    ];

    let yPos = 100;
    patientInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.text(info.label, 15, yPos);
      doc.setFont("helvetica", "normal");
      const splitValue = doc.splitTextToSize(String(info.value), 60); // Wrap text if too long
      doc.text(splitValue, 50, yPos);
      yPos += 10 + (splitValue.length - 1) * 5; // Adjust for multi-line text
    });

    // --- APPOINTMENT INFO SECTION ---
    doc.setFillColor(240, 250, 245);
    doc.setDrawColor(220, 240, 230);
    doc.roundedRect(105, 80, 90, 90, 2, 2, "FD");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("APPOINTMENT DETAILS", 110, 90);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const appointmentInfo = [
      { label: "Doctor:", value: item.doctorName || "N/A" },
      { label: "Specialization:", value: item.specialization || "N/A" },
      {
        label: "Date:",
        value: item.date ? new Date(item.date).toLocaleDateString("en-GB") : "N/A",
      },
      { label: "Time:", value: item.time || "N/A" },
    ];

    yPos = 100;
    appointmentInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.text(info.label, 110, yPos);
      doc.setFont("helvetica", "normal");
      const splitValue = doc.splitTextToSize(String(info.value), 60);
      doc.text(splitValue, 145, yPos);
      yPos += 10 + (splitValue.length - 1) * 5;
    });

    // --- INSTRUCTIONS SECTION ---
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(10, 180, 190, 40, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(43, 44, 108); // #2b2c6c
    doc.text("INSTRUCTIONS", 15, 190);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const instructions = "Please arrive 15 minutes before your appointment time. Bring your ID and insurance information if applicable. Contact our help desk at 1-800-HEALTH for rescheduling or inquiries.";
    const splitInstructions = doc.splitTextToSize(instructions, 180);
    doc.text(splitInstructions, 15, 200);

    // --- FOOTER SECTION ---

    // Create bottom border
    doc.setDrawColor(43, 44, 108); // #2b2c6c
    doc.setFillColor(43, 44, 108);
    doc.rect(
      0,
      doc.internal.pageSize.height - 20,
      doc.internal.pageSize.width,
      2,
      "F"
    );

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Left side - notice
      doc.text(
        "Appointment confirmation document - Internal use only",
        10,
        doc.internal.pageSize.height - 12
      );

      // Center - website
      doc.text(
        "www.mediflow.com",
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.height - 12,
        {
          align: "center",
        }
      );

      // Right - page number and generation date
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 10,
        doc.internal.pageSize.height - 12,
        { align: "right" }
      );

      // Add color accent at bottom
      doc.setFillColor(47, 178, 151); // #2fb297
      doc.rect(
        0,
        doc.internal.pageSize.height - 5,
        doc.internal.pageSize.width,
        5,
        "F"
      );
    }

    // Add the watermark after all pages are created
    addWatermark(doc);

    // Save the PDF
    doc.save(`Appointment-${item.name.replace(/\s+/g, "-")}_${Date.now()}.pdf`);
  };

  if (!patientDetails) {
    return (
      <div className="bg-[#ffffff] min-h-screen">
        <Nav />
        <SectionHeader title="Appointment Details" />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="bg-[#f5f5f5] rounded-xl shadow-lg p-8 text-center">
            <div className="text-[#2b2c6c] mb-4 flex justify-center">
              <UserCircle size={64} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-[#2b2c6c] mb-4">
              No appointment details available
            </h2>
            <p className="text-[#828487] mb-6">
              Your appointment information could not be found.
            </p>
            <button
              onClick={() => navigate("/Home")}
              className="flex items-center justify-center mx-auto bg-[#2b2c6c] hover:bg-[#71717d] text-white py-3 px-6 rounded-lg transition duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Return Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen">
      <Nav />
      <SectionHeader title="Appointment Details" />

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl">
          {emailStatus && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                emailStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {emailStatus.message}
            </div>
          )}

          <div className="bg-[#eaecee] rounded-xl shadow-lg overflow-hidden border border-[#2fb297]">
            <div className="bg-gradient-to-r from-[#2b2c6c] to-[#e6317d] py-5 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {isEditing ? (
                  <>
                    <UserCircle size={24} className="mr-2" />
                    Edit Your Appointment Details
                  </>
                ) : (
                  <>
                    <Calendar size={24} className="mr-2" />
                    Your Appointment Details
                  </>
                )}
              </h2>
              <p className="text-gray-200 mt-1">
                {isEditing
                  ? "Update your personal information"
                  : `Appointment with ${patientDetails.doctorName} - ${patientDetails.specialization}`}
              </p>
            </div>

            {!isEditing && (
              <div className="bg-indigo-50 p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Date & Time
                    </p>
                    <p className="text-indigo-800 font-medium">
                      {new Date(patientDetails.date).toLocaleDateString("en-GB")}{" "}
                      | {patientDetails.time}
                    </p>
                  </div>
                  <div className="bg-[#2fb297] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Confirmed
                  </div>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="p-6">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={24} className="text-[#2b2c6c]" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneCall size={24} className="text-[#2b2c6c]" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number (e.g., 0712345678)"
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
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      NIC
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <IdCard size={24} className="text-[#2b2c6c]" />
                      </div>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="Enter your NIC (e.g., 123456789V or 200012345678)"
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
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={24} className="text-[#2b2c6c]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                    <label className="block text-gray-700 text-base font-medium mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                        <MapPin size={24} className="text-[#2b2c6c]" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter your address"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:border-transparent h-12 resize-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 bg-[#828487] hover:bg-[#71717d] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center"
                      style={{ borderRadius: "7px" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#e6317d] hover:bg-[#2b2c6c] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center"
                      style={{ borderRadius: "7px" }}
                    >
                      Save Changes
                      <CheckCircle size={24} className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-[#2b2c6c]">
                      Patient Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircle size={24} className="text-[#2b2c6c]" />
                      </div>
                      <p className="text-gray-700">{patientDetails.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Phone
                    </label>
                    <div className="relative pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PhoneCall size={24} className="text-[#2b2c6c]" />
                      </div>
                      <p className="text-gray-700">{patientDetails.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      NIC
                    </label>
                    <div className="relative pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <IdCard size={24} className="text-[#2b2c6c]" />
                      </div>
                      <p className="text-gray-700">{patientDetails.nic || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={24} className="text-[#2b2c6c]" />
                      </div>
                      <p className="text-gray-700">{patientDetails.email}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address
                    </label>
                    <div className="relative pl-12 pr-4 py-2.5 bg-[#f5f5f5] border border-[#828487] rounded-lg h-17">
                      <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                        <MapPin size={24} className="text-[#2b2c6c]" />
                      </div>
                      <p className="text-gray-700 py-2">
                        {patientDetails.address}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4 grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="py-2.5 bg-[#2b2c6c] hover:bg-[#71717d] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2b2c6c] focus:ring-opacity-50 flex items-center justify-center"
                      style={{ borderRadius: "7px" }}
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Details
                    </button>
                    <button
                      onClick={handleDelete}
                      className="py-2.5 bg-[#e6317d] hover:bg-[#71717d] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#e6317d] focus:ring-opacity-50 flex items-center justify-center"
                      style={{ borderRadius: "7px" }}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Cancel Appointment
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isSendingEmail}
                      className={`w-full py-2.5 ${
                        isSendingEmail
                          ? "bg-gray-400"
                          : "bg-[#2fb297] hover:bg-[#71717d]"
                      } text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2fb297] focus:ring-opacity-50 flex items-center justify-center`}
                      style={{ borderRadius: "7px" }}
                    >
                      {isSendingEmail ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} className="mr-2" />
                          Confirm
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border-l-4 border-[#2fb297] flex items-start">
            <div className="mr-3 text-[#2fb297] mt-1">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-[#2b2c6c] font-medium text-sm">
                Important Information
              </h3>
              <p className="text-sm text-[#828487] mt-1">
                If you need to reschedule your appointment or have any questions,
                please contact our help desk at{" "}
                <span className="font-medium">1-800-HEALTH</span>. Please arrive
                15 minutes before your appointment time. Bring your ID and
                insurance information if applicable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DisplayAppointment;