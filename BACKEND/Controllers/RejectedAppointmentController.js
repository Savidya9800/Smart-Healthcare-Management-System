const RejectedAppointment = require('../Models/RejectAppoinmentModel');

exports.getAllRejectedAppointments = async (req, res) => {
  try {
    const appointments = await RejectedAppointment.find().lean();
    console.log(`Fetched ${appointments.length} rejected appointments`);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching rejected appointments:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching rejected appointments', error: error.message });
  }
};

exports.deleteRejectedAppointment = async (req, res) => {
  try {
    const deleted = await RejectedAppointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log(`Rejected appointment with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Appointment not found' });
    }
    console.log(`Deleted rejected appointment with ID ${req.params.id}`);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting rejected appointment:', error.message, error.stack);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};