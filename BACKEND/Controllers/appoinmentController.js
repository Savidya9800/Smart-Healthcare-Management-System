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

//  Add appointment (fix duplicate key error)
const addAppoinment = async (req, res) => {
    try {
        const { indexno, name, nic, phone, email, doctorName, specialization, date, time, slip } = req.body;

        // 🔹 Check if indexno already exists
        const existingAppointment = await Appoinment.findOne({ indexno });

        if (existingAppointment) {
            return res.status(400).json({ error: "Appointment with this index number already exists" });
        }

        // 🔹 Create a new appointment
        const newAppointment = new Appoinment({ indexno, name, nic, phone, email, doctorName, specialization, date, time, slip });

        await newAppointment.save();

        return res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (err) {
        console.error("Error adding appointment:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
//Get by id
const getById = async (req, res, next)=>{
    const id =req.params.id;

    let appoinment;

    try{
        appoinment=await Appoinment.findById(id);
    }catch (err){
        console.log(err);
    }

    //not available appoinment
    if(!appoinment){
        return res.status(404).json({message:"User Not Found"});
    }
    return res.status(200).json({appoinment});
}
//Update appoinment details
const updateAppoinment =async (req,res, next) =>{

    const id =req.params.id;
    const { indexno, name, nic, phone, email, doctorName, specialization, date, time, slip } = req.body;

    let appoinment;

    try{
        appoinment = await Appoinment.findByIdAndUpdate(id,
            {indexno:indexno, name:name, nic:nic, phone:phone, email:email, doctorName:doctorName, specialization:specialization, date:date, time:time, slip:slip});
            appoinment =await appoinment.save();
    }catch(err){
        console.log(err);
        //not update appoinment
    if(!appoinment){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({appoinment});

    }
};
//Delete appoinment
const deleteAppoinment = async (req, res, next) => {
    const id =req.params.id;

    let appoinment

    try{
        appoinment=await Appoinment.findByIdAndDelete(id)
    }catch(err) {
      console.log(err);
       //not delete appoinment
    if(!appoinment){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({appoinment});

    }

}
//  Export functions
module.exports = { getAllAppoinments, addAppoinment ,getById, updateAppoinment, deleteAppoinment};
