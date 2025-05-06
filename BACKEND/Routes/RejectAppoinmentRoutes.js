const express = require('express');
const router = express.Router();
const rejectedController = require('../Controllers/RejectedAppointmentController');

router.get('/', rejectedController.getAllRejectedAppointments);
router.delete('/:id', rejectedController.deleteRejectedAppointment);

module.exports = router;