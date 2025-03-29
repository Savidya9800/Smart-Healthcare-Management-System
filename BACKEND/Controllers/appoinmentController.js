const Appoinment = require("../Models/AppoinmentModel");

// Get all appointments
const getAllAppoinments = async (req, res) => {
    try {
        const appoinments = await Appoinment.find();
        
        if (!appoinments || appoinments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        return res.status(200).json({ appoinments });
    } catch (err) {
        console.error("Error fetching appointments:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Add appointment (fix duplicate key error)
const addAppoinment = async (req, res) => {
    try {
        

        // 🔹 Get the last indexno from the collection and generate the next one
        const lastAppointment = await Appoinment.findOne().sort({ indexno: -1 });
        
        let newIndex = 'A0001'; // Default index if no appointment exists

        if (lastAppointment) {
            const lastIndex = lastAppointment.indexno.substring(1);
            const nextIndex = parseInt(lastIndex) + 1;
            newIndex = 'A' + nextIndex.toString().padStart(4, '0');
        }
        const { name, address, nic, phone, email, doctorName, specialization, date, time, slip, doctor_id , patient_id } = req.body;
        const newAppointment = new Appoinment({ 
            indexno: newIndex, 
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
        });

        await newAppointment.save();

        return res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (err) {
        console.error("Error adding appointment:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Get appointment by ID
const getById = async (req, res) => {
    const id = req.params.id;

    try {
        const appoinment = await Appoinment.findById(id);

        if (!appoinment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({ appoinment });
    } catch (err) {
        console.error("Error fetching appointment by ID:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update appointment details
const updateAppoinment = async (req, res) => {
    const id = req.params.id;
    const { indexno, name, address, nic, phone, email, doctorName, specialization, date, time, slip,doctor_id } = req.body;

    try {
        const appoinment = await Appoinment.findByIdAndUpdate(id, 
            {
                indexno,
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
                doctor_id
            }, 
            { new: true }
        );

        if (!appoinment) {
            return res.status(404).json({ message: "Unable to update appointment" });
        }

        return res.status(200).json({ appoinment });
    } catch (err) {
        console.error("Error updating appointment:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete appointment
const deleteAppoinment = async (req, res) => {
    const id = req.params.id;

    try {
        const appoinment = await Appoinment.findByIdAndDelete(id);

        if (!appoinment) {
            return res.status(404).json({ message: "Unable to delete appointment" });
        }

        return res.status(200).json({ message: "Appointment deleted successfully", appoinment });
    } catch (err) {
        console.error("Error deleting appointment:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Get appointment ID from URL params
        const { status } = req.body; // Get status from request body

        // Validate status value
        if (!["Pending", "Completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Find and update the appointment
        const updatedAppointment = await Appoinment.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Status updated successfully", updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Export functions
module.exports = { 
    getAllAppoinments, 
    addAppoinment, 
    getById, 
    updateAppoinment, 
    deleteAppoinment,
    updateAppointmentStatus
};
