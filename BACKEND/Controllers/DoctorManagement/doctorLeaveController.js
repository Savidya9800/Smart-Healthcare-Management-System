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
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted" });
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
