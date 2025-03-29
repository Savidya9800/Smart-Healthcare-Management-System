const express = require("express");
const router = express.Router();
const {
  getAllLeaves,
  getLeaveById,
  createLeaveRequest,
  updateLeaveStatus,
  deleteLeaveRequest,
  updateLeaveRequest
} = require("../../Controllers/DoctorManagement/doctorLeaveController");

router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.post("/", createLeaveRequest);
router.put("/:id/status", updateLeaveStatus); // Update leave status (Approve/Reject)
router.put("/:id/update", updateLeaveRequest); // Update leave request (only start and end dates)
router.delete("/:id", deleteLeaveRequest);

module.exports = router;
