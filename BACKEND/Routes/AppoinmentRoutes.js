const express = require("express");
const router =express.Router();

//Insert Model
const Appoinment = require("../Models/AppoinmentModel");

//Insert appoinment controller
const appoinmentController = require("../Controllers/appoinmentController");

router.get("/",appoinmentController.getAllAppoinments);
router.post("/",appoinmentController.addAppoinment);
router.put("/:id/status",appoinmentController.updateAppointmentStatus);
router.get("/:id",appoinmentController.getById);
router.put("/:id",appoinmentController.updateAppoinment);
router.delete("/:id",appoinmentController.deleteAppoinment);



//export
module.exports = router;