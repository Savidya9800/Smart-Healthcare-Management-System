const DoctorLeave = require("../../Models/DoctorManagement/doctorLeaveModel");

// Get all leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await DoctorLeave.find().populate("doctorId");
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get leave by ID
const getLeaveById = async (req, res) => {
  try {
    const leave = await DoctorLeave.findById(req.params.id).populate("doctorId");
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.status(200).json(leave);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create leave request
const createLeaveRequest = async (req, res) => {
  const { doctorId, leaveType, startDate,endDate, reason } = req.body;
  try {
    const newLeave = new DoctorLeave({
        doctorId,
        leaveType,
        startDate: new Date(startDate), // Ensure it's a proper Date object
        endDate: new Date(endDate),
        reason,
        status: "Plan",
      });
      newLeave
        .save()
        .then(result => console.log("Leave saved:", result))
        .catch(error => console.error("Save failed:", error));
    res.status(201).json(newLeave);
    
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update leave status (Plan, Taken, Cancelled, Ongoing)
const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  // Ensure the status is one of the allowed values
  if (!["Plan", "Taken", "Cancelled", "Ongoing"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const leave = await DoctorLeave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status; // Set the new status
    await leave.save();

    res.status(200).json({ message: "Leave status updated", leave });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete leave request
const deleteLeaveRequest = async (req, res) => {
  try {
    const leave = await DoctorLeave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res.status(200).json({ leave, message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update leave request (only start and end dates)
const updateLeaveRequest = async (req, res) => {
  const { startDate, endDate } = req.body;

  // Ensure startDate and endDate are provided
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start Date and End Date are required." });
  }

  // Validate the dates
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ message: "End date must be after start date." });
  }

  try {
    const leave = await DoctorLeave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Update the start and end dates
    leave.startDate = new Date(startDate); // Ensure proper Date format
    leave.endDate = new Date(endDate);

    // Save the updated leave
    await leave.save();

    res.status(200).json({ message: "Leave request updated", leave });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get leaves by doctor ID
const getLeavesByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const leaves = await DoctorLeave.find({ doctorId }).populate("doctorId");

    if (leaves.length === 0) {
      return res.status(200).json(leaves);
    }

    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};




// Export Controllers
exports.getAllLeaves = getAllLeaves;
exports.getLeaveById = getLeaveById;
exports.createLeaveRequest = createLeaveRequest;
exports.updateLeaveStatus = updateLeaveStatus;
exports.deleteLeaveRequest = deleteLeaveRequest;
exports.updateLeaveRequest = updateLeaveRequest;
exports.getLeavesByDoctorId = getLeavesByDoctorId;
