const Appointment = require("../Models/AppoinmentModel");
const User = require("../Models/UserModel");
const RejectedAppointment = require("../Models/RejectAppoinmentModel");
const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {
      name,
      address,
      nic,
      phone,
      email,
      doctorName,
      doctor_id,
      specialization,
      date,
      time,
      user_id,
    } = req.body;

    // Verify user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (
      !name ||
      !address ||
      !phone ||
      !email ||
      !doctorName ||
      !doctor_id ||
      !specialization ||
      !date ||
      !time ||
      !user_id
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Generate appointment index number
    const appointmentCount = await Appointment.countDocuments();
    const indexno = `APP${String(appointmentCount + 1).padStart(4, "0")}`;

    const newAppointment = new Appointment({
      indexno,
      name,
      address,
      nic,
      phone,
      email,
      doctorName,
      doctor_id,
      specialization,
      date,
      time,
      user_id,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ appoinments: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send confirmation email
const sendConfirmationEmail = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate(
      "user_id"
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: "Appointment Confirmation - Medi Flow",
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${appointment.name},</p>
        <p>Your appointment has been successfully booked with the following details:</p>
        <ul>
          <li><strong>Appointment ID:</strong> ${appointment.indexno}</li>
          <li><strong>Doctor:</strong> ${appointment.doctorName}</li>
          <li><strong>Specialization:</strong> ${appointment.specialization}</li>
          <li><strong>Date:</strong> ${new Date(
            appointment.date
          ).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
        </ul>
        <p>Please arrive 15 minutes early and bring your ID.</p>
        <p>Thank you for choosing Medi Flow!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    res.status(500).json({ error: "Failed to send confirmation email" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject appointment by ID
const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    // Validate rejection reason
    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    // Find the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create a new RejectedAppointment record
    const rejectedAppointment = new RejectedAppointment({
      indexno: appointment.indexno,
      name: appointment.name,
      address: appointment.address,
      nic: appointment.nic,
      phone: appointment.phone,
      email: appointment.email,
      doctorName: appointment.doctorName,
      doctor_id: appointment.doctor_id,
      specialization: appointment.specialization,
      date: appointment.date,
      time: appointment.time,
      patient_id: appointment.user_id,
      status: "Rejected",
      rejectionReason,
      rejectedAt: new Date(),
      originalAppointmentId: appointment._id,
    });

    await rejectedAppointment.save();

    // Delete the original appointment
    await Appointment.findByIdAndDelete(id);

    // Send rejection email to the user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: "Appointment Rejection - Medi Flow",
      html: `
        <h2>Appointment Rejection</h2>
        <p>Dear ${appointment.name},</p>
        <p>We regret to inform you that your appointment has been rejected for the following reason:</p>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>Appointment Details:</p>
        <ul>
          <li><strong>Appointment ID:</strong> ${appointment.indexno}</li>
          <li><strong>Doctor:</strong> ${appointment.doctorName}</li>
          <li><strong>Specialization:</strong> ${appointment.specialization}</li>
          <li><strong>Date:</strong> ${new Date(
            appointment.date
          ).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointment.time}</li>
        </ul>
        <p>Please contact us for further assistance or to reschedule.</p>
        <p>Thank you for choosing Medi Flow.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Appointment rejected successfully",
      rejectedAppointment,
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  sendConfirmationEmail,
  rejectAppointment,
  updateAppointmentStatus,
};