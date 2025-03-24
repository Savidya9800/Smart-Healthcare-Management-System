const mongoose=require('mongoose');
const Schema=mongoose.Schema; 

const stockSchema=new Schema({
    name:{
        type:String,
        required:[true,'Medicine name is required'],
        trim:true,
        minlength:[2,'Name must not be at least 2 characters long'],
    },
    type:{
        type:String,
        required:[true,'Type is requires'],
        trim:true,
        enum:['Tablet','Syrup','Injection','Capsule','Ointment','Cream','Gel','Lotion','Drops','Suppository','Powder','Inhaler'],
    },
    company:{
        type:String,
        required:[true,'Company name is required'],
        trim:true,
    },
    quantity:{
        type:Number,
        required:[true,'Quantity is required'],
        min:[1,'Quantity must be at least 1'],
    },
    expireDate:{
        type:Date,
        required:[true,'Expiration date is required'],
        validate:{
            validator: function(value){
                return value>new Date();//ensures expiry date is in the future
            },
            message:'Expiration date must be in the future',//error message if validation fails.
        },
    },
    batchNo:{
        type:String,
        required:[true,'Batch number is required'],
        trim:true,
        unique:true,
    },
    packSize:{
        type:Number,
        required:[true,'Pack size is required'],
        min:[1,'Pack size must be at least 1'],
    },
    location:{
        type:String,
        required:[true,'Location is required'],
        trim:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
},
    {timestamps:true});
    
module.exports=mongoose.model(
    'Stock',//file name
    stockSchema);//function name