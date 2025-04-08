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
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    axios
      .get("http://localhost:5000/api/appoinment/")
      .then((response) => {
        const lastAppointment =
          response.data.appoinments[response.data.appoinments.length - 1];
        setPatientDetails(lastAppointment);
        setFormData(lastAppointment);
      })
      .catch((error) => {
        console.error("Error fetching appointment details:", error);
      });
  }, []);

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
    
    if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nic)) {
      tempErrors.nic = "Invalid NIC (e.g., 123456789V or 123456789012)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/appoinment/${patientDetails._id}`,
        formData
      )
      .then((response) => {
        setPatientDetails(formData);
        setIsEditing(false);
        navigate("/Appoinment-Display");
      })
      .catch((error) => {
        console.error("Error updating appointment details:", error);
      });
  };

  const handleConfirm = async () => {
    if (!patientDetails || !patientDetails._id) {
      setEmailStatus({
        success: false,
        message: "No appointment details available to send confirmation"
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/appoinment/send-confirmation",
        { appointmentId: patientDetails._id }
      );

      setEmailStatus({
        success: true,
        message: "Confirmation email sent successfully!"
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/Home");
      }, 2000);
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      setEmailStatus({
        success: false,
        message: error.response?.data?.error || "Failed to send confirmation email. Please try again later."
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/api/appoinment/${patientDetails._id}`)
        .then((response) => {
          console.log("Appointment deleted successfully");
          navigate("/Home");
        })
        .catch((error) => {
          console.error("Error deleting appointment:", error);
        });
    }
  };

  const generateAppointmentPDF = (patientDetails) => {
    if (!patientDetails) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const colors = {
      primary: "#2C3E50", 
      accent: "#3498DB", 
      background: "#ECF0F1", 
      text: "#2C3E50", 
      highlight: "#27AE60", 
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    doc.setFillColor(colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(colors.primary);
    doc.rect(0, 0, pageWidth, 30, "F");

    // You'd normally need to import the logo separately, but for now we'll skip it
    // const logoWidth = 30;
    // const logoHeight = 30;
    // doc.addImage(Logo22, "PNG", margin, 5, logoWidth, logoHeight);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MEDI FLOW", margin, 18);

    doc.setFontSize(13);
    doc.text("Appointment Confirmation", margin, 24);

    doc.setFontSize(18);
    doc.setTextColor(colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", margin, 50);

    doc.setLineWidth(0.5);
    doc.setDrawColor(colors.accent);
    doc.line(margin, 55, pageWidth - margin, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(colors.text);

    const detailsStartY = 65;
    const lineHeight = 7;
    const labelColor = colors.accent;

    const patientDetailsLayout = [
      { label: "Appoinment ID", value: patientDetails.indexno || "N/A" },
      { label: "Full Name", value: patientDetails.name || "N/A" },
      { label: "Phone Number", value: patientDetails.phone || "N/A" },
      { label: "National ID", value: patientDetails.nic || "N/A" },
      { label: "Email", value: patientDetails.email || "N/A" },
      { label: "Address", value: patientDetails.address || "N/A" },
    ];

    patientDetailsLayout.forEach((detail, index) => {
      doc.setTextColor(labelColor);
      doc.setFont("helvetica", "bold");
      doc.text(
        detail.label + ":",
        margin,
        detailsStartY + index * lineHeight
      );

      doc.setTextColor(colors.text);
      doc.setFont("helvetica", "normal");
      doc.text(
        detail.value,
        margin + 40,
        detailsStartY + index * lineHeight
      );
    });

    doc.setFontSize(18);
    doc.setTextColor(colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Appointment Details",
      margin,
      detailsStartY + patientDetailsLayout.length * lineHeight + 10
    );

    doc.setLineWidth(0.5);
    doc.setDrawColor(colors.accent);
    doc.line(
      margin,
      detailsStartY + patientDetailsLayout.length * lineHeight + 15,
      pageWidth - margin,
      detailsStartY + patientDetailsLayout.length * lineHeight + 15
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(colors.text);

    const appointmentDetailsStartY =
      detailsStartY + patientDetailsLayout.length * lineHeight + 25;
    const appointmentDetailsLayout = [
      { label: "Doctor", value: patientDetails.doctorName || "N/A" },
      { label: "Specialization", value: patientDetails.specialization || "N/A" },
      {
        label: "Date",
        value: patientDetails.date ? new Date(patientDetails.date).toLocaleDateString("en-GB") : "N/A",
      },
      { label: "Time", value: patientDetails.time || "N/A" },
    ];

    appointmentDetailsLayout.forEach((detail, index) => {
      doc.setTextColor(labelColor);
      doc.setFont("helvetica", "bold");
      doc.text(
        detail.label + ":",
        margin,
        appointmentDetailsStartY + index * lineHeight
      );

      doc.setTextColor(colors.text);
      doc.setFont("helvetica", "normal");
      doc.text(
        detail.value,
        margin + 40,
        appointmentDetailsStartY + index * lineHeight
      );
    });

    doc.setLineWidth(0.2);
    doc.setDrawColor(colors.primary);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    doc.setFontSize(8);
    doc.setTextColor(colors.text);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      "Confidential Document",
      pageWidth - margin - 40,
      pageHeight - 10
    );

    doc.save(
      `MediFlow_Appointment_${patientDetails.name}_${Date.now()}.pdf`
    );
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
              onClick={() => navigate("/home")}
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
            <div className={`mb-4 p-4 rounded-lg ${emailStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {emailStatus.message}
            </div>
          )}

          <div className="bg-[#eaecee] rounded-xl shadow-lg overflow-hidden border border-[#2fb297]">
            {/* Card Header */}
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
            
            {/* Appointment Summary */}
            {!isEditing && (
              <div className="bg-indigo-50 p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Date & Time
                    </p>
                    <p className="text-indigo-800 font-medium">
                      {new Date(patientDetails.date).toLocaleDateString(
                        "en-GB"
                      )}{" "}
                      | {patientDetails.time}
                    </p>
                  </div>
                  <div className="bg-[#2fb297] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Confirmed
                  </div>
                </div>
              </div>
            )}
            
            {/* Form Content */}
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
                        required
                        placeholder="Enter your NIC (e.g., 123456789V or 123456789012)"
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
                      <p className="text-gray-700">{patientDetails.nic}</p>
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
                      onClick={() => generateAppointmentPDF(patientDetails)}
                      className="py-2.5 bg-[#2fb297] hover:bg-[#71717d] text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2fb297] focus:ring-opacity-50 flex items-center justify-center"
                      style={{ borderRadius: "7px" }}
                    >
                      <Download size={18} className="mr-2" />
                      Download PDF
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      onClick={handleConfirm}
                      disabled={isSendingEmail}
                      className={`w-full py-2.5 ${isSendingEmail ? 'bg-gray-400' : 'bg-[#2fb297] hover:bg-[#71717d]'} text-white rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#2fb297] focus:ring-opacity-50 flex items-center justify-center`}
                      style={{ borderRadius: "7px" }}
                    >
                      {isSendingEmail ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} className="mr-2" />
                          Confirm & Return Home
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
                If you need to reschedule your appointment or have any
                questions, please contact our help desk at{" "}
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