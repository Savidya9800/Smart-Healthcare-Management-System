const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
    indexno: { type: String, unique: true, },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    nic: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
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
        data: { type: Buffer, default: null }, 
        contentType: { type: String, default: null }, 
    }
});

module.exports = mongoose.model("Appoinment", appoinmentSchema);
