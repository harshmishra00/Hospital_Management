const mongoose= require('mongoose')

const postSchema=mongoose.Schema({
    patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "patient"
        },
        description:String,

})

module.exports=mongoose.model("posts", postSchema)