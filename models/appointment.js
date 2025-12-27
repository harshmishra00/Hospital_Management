const mongoose=require("mongoose")

const appointmentSchema=mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient"
    },
    date:String,
    time:String,
    reason:String,
    doctor:String,

})

module.exports=mongoose.model("appointment", appointmentSchema)