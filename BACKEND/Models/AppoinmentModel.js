const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const appoinmentSchema=new Schema({
    indexno: { type: String, required: true, unique: true },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nic: {
        type: String,
        require:true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    slip: {
        data: Buffer, // Stores binary image data
        contentType: String, // Stores image type (e.g., "image/png", "image/jpeg")
    }

});

module.exports =mongoose.model(
    "Appoinment",//file name
    appoinmentSchema //function name
)