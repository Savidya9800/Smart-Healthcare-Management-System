const express = require("express");
const router = express.Router();
const appoinmentController = require('../Controllers/appoinmentController');

router.get("/", appoinmentController.getAllAppoinments);
router.post("/", appoinmentController.addAppoinment);
router.put("/:id/status", appoinmentController.updateAppointmentStatus);
router.get("/:id", appoinmentController.getById);
router.put("/:id", appoinmentController.updateAppoinment);
router.delete("/:id", appoinmentController.deleteAppoinment);
router.post("/send-confirmation", appoinmentController.sendConfirmationEmail);
router.post('/:id/reject', appoinmentController.rejectAppointment);

module.exports = router;