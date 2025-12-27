const mongoose = require("mongoose")

<<<<<<< HEAD
mongoose.connect(`mongodb+srv://harshmishra23_db_user:harshmishra123@cluster0.o5hjufc.mongodb.net/HospitalManagement`);

const patientSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    gender:String,
    age:Number,
=======
const patientSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    age: Number,
>>>>>>> 56e7035 (Added more things)

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

<<<<<<< HEAD
module.exports=mongoose.model("patient", patientSchema) 
=======
module.exports = mongoose.model("patient", patientSchema) 
>>>>>>> 56e7035 (Added more things)
