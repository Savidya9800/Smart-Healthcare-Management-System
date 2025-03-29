const express = require("express");
const router =express.Router();

//Insert Model
const Appoinment = require("../Models/AppoinmentModel");

//Insert appoinment controller
const appoinmentController = require("../Controllers/appoinmentController");

router.get("/",appoinmentController.getAllAppoinments);
router.post("/",appoinmentController.addAppoinment);
router.get("/:id",appoinmentController.getById);
router.put("/:id",appoinmentController.updateAppoinment);
router.delete("/:id",appoinmentController.deleteAppoinment);




module.exports = router;