const Appoinment = require("../Models/AppoinmentModel");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all appointments
const getAllAppoinments = async (req, res) => {
    try {
        const appoinments = await Appoinment.find()
            .populate('doctor_id', 'name specialization')
            .populate('patient_id', 'name email');
        
        if (!appoinments || appoinments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        return res.status(200).json({ appoinments });
    } catch (err) {
        console.error("Error fetching appointments:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Add appointment with email confirmation
const addAppoinment = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'doctor_id', 'date', 'time'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: "Missing required fields", 
                missingFields 
            });
        }

        // Generate appointment ID
        const lastAppointment = await Appoinment.findOne().sort({ indexno: -1 });
        let newIndex = 'A0001'; 

        if (lastAppointment) {
            const lastIndex = lastAppointment.indexno.substring(1);
            const nextIndex = parseInt(lastIndex) + 1;
            newIndex = 'A' + nextIndex.toString().padStart(4, '0');
        }

        const { 
            name, 
            address, 
            nic, 
            phone, 
            email, 
            doctorName, 
            specialization, 
            date, 
            time, 
            slip, 
            doctor_id, 
            patient_id 
        } = req.body;
        
        // Validate doctor_id
        if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
            return res.status(400).json({ error: "Invalid doctor ID format" });
        }

        // Prepare appointment data
        const appointmentData = { 
            indexno: newIndex, 
            name, 
            address: address || 'Not provided',
            nic: nic || 'Not provided',
            phone, 
            email, 
            doctorName, 
            specialization, 
            date, 
            time, 
            slip,
            doctor_id,
            status: "Pending"
        };

        // Add patient_id only if valid
        if (patient_id && mongoose.Types.ObjectId.isValid(patient_id)) {
            appointmentData.patient_id = patient_id;
        }

        const newAppointment = new Appoinment(appointmentData);
        await newAppointment.save();

        // Send confirmation email
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Appointment Confirmation',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2b2c6c;">Your Appointment Has Been Confirmed</h2>
                        <p>Dear ${name},</p>
                        <p>Your appointment has been successfully booked with the following details:</p>
                        
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>Appointment ID:</strong> ${newIndex}</p>
                            <p><strong>Doctor:</strong> ${doctorName}</p>
                            <p><strong>Specialization:</strong> ${specialization}</p>
                            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${time}</p>
                        </div>
                        
                        <p>Please arrive 15 minutes before your scheduled time.</p>
                        <p>Thank you for choosing our service.</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError.message);
            // Don't fail the request if email fails
        }

        return res.status(201).json({ 
            message: "Appointment created successfully", 
            appointment: newAppointment 
        });
    } catch (err) {
        console.error("Error adding appointment:", err.message);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({ 
                error: "Validation error", 
                details: errors 
            });
        }
        
        return res.status(500).json({ 
            error: "Internal server error",
            details: err.message 
        });
    }
};

// Get appointment by ID
const getById = async (req, res) => {
    try {
        const appoinment = await Appoinment.findById(req.params.id)
            .populate('doctor_id', 'name specialization')
            .populate('patient_id', 'name email');

        if (!appoinment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ appoinment });
    } catch (err) {
        console.error("Error fetching appointment by ID:", err.message);
        
        if (err.name === 'CastError') {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update appointment details
const updateAppoinment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.indexno;
        delete updates._id;

        // Validate doctor_id if provided
        if (updates.doctor_id && !mongoose.Types.ObjectId.isValid(updates.doctor_id)) {
            return res.status(400).json({ error: "Invalid doctor ID format" });
        }

        // Validate patient_id if provided
        if (updates.patient_id && !mongoose.Types.ObjectId.isValid(updates.patient_id)) {
            return res.status(400).json({ error: "Invalid patient ID format" });
        }

        const updatedAppointment = await Appoinment.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ 
            message: "Appointment updated successfully",
            appointment: updatedAppointment 
        });
    } catch (err) {
        console.error("Error updating appointment:", err.message);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({ 
                error: "Validation error", 
                details: errors 
            });
        }
        
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete appointment
const deleteAppoinment = async (req, res) => {
    try {
        const deletedAppointment = await Appoinment.findByIdAndDelete(req.params.id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ 
            message: "Appointment deleted successfully",
            appointment: deletedAppointment 
        });
    } catch (err) {
        console.error("Error deleting appointment:", err.message);
        
        if (err.name === 'CastError') {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pending", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ 
                error: "Invalid status value",
                allowedValues: ["Pending", "Completed", "Cancelled"]
            });
        }

        const updatedAppointment = await Appoinment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Send status update email
        try {
            let subject = '';
            let html = '';

            if (status === "Completed") {
                subject = 'Appointment Completed';
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2b2c6c;">Appointment Completed</h2>
                        <p>Dear ${updatedAppointment.name},</p>
                        <p>Your appointment with Dr. ${updatedAppointment.doctorName} has been marked as completed.</p>
                        <p>Thank you for choosing our service.</p>
                    </div>
                `;
            } else if (status === "Cancelled") {
                subject = 'Appointment Cancelled';
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e6317d;">Appointment Cancelled</h2>
                        <p>Dear ${updatedAppointment.name},</p>
                        <p>Your appointment with Dr. ${updatedAppointment.doctorName} has been cancelled.</p>
                        <p>If this was a mistake, please contact our support team.</p>
                    </div>
                `;
            }

            if (subject && html) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: updatedAppointment.email,
                    subject,
                    html
                };
                await transporter.sendMail(mailOptions);
            }
        } catch (emailError) {
            console.error("Failed to send status email:", emailError.message);
            // Don't fail the request if email fails
        }

        res.status(200).json({ 
            message: "Status updated successfully", 
            appointment: updatedAppointment 
        });
    } catch (error) {
        console.error("Error updating appointment status:", error.message);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid appointment ID format" });
        }
        
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
};

// Send confirmation email
const sendConfirmationEmail = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        
        if (!appointmentId) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        const appointment = await Appoinment.findById(appointmentId)
            .populate('doctor_id', 'name specialization');
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: appointment.email,
            subject: 'Appointment Confirmed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2b2c6c;">Your Appointment Has Been Confirmed</h2>
                    <p>Dear ${appointment.name},</p>
                    <p>Your appointment has been successfully confirmed with the following details:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Appointment ID:</strong> ${appointment.indexno}</p>
                        <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
                        <p><strong>Specialization:</strong> ${appointment.specialization}</p>
                        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointment.time}</p>
                    </div>
                    
                    <p>Please arrive 15 minutes before your scheduled time.</p>
                    <p>Thank you for choosing our service.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ 
            message: "Confirmation email sent successfully",
            appointmentId: appointment._id
        });
    } catch (error) {
        console.error("Error sending confirmation email:", error.message);
        return res.status(500).json({ 
            error: "Failed to send confirmation email",
            details: error.message 
        });
    }
};

module.exports = { 
    getAllAppoinments, 
    addAppoinment, 
    getById, 
    updateAppoinment, 
    deleteAppoinment,
    updateAppointmentStatus,
    sendConfirmationEmail
};