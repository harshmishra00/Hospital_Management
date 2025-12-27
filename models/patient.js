const mongoose = require("mongoose")


mongoose.connect(`mongodb+srv://harshmishra23_db_user:harshmishra123@cluster0.o5hjufc.mongodb.net/HospitalManagement`);

const patientSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    gender:String,
    age:Number,

    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointment"
        }
    ],

    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
})


module.exports=mongoose.model("patient", patientSchema);

