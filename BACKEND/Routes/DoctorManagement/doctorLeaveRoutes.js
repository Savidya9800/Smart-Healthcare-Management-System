const express = require("express");
const router = express.Router();
const {
  getAllLeaves,
  getLeaveById,
  createLeaveRequest,
  updateLeaveStatus,
  deleteLeaveRequest
} = require("../../Controllers/DoctorManagement/doctorLeaveController");

router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.post("/", createLeaveRequest);
router.put("/:id/status", updateLeaveStatus); // Update leave status (Approve/Reject)
router.delete("/:id", deleteLeaveRequest);

module.exports = router;
