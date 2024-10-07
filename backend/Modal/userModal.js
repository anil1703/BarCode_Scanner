import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true
    },
    password : {
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    }

})

const userDb = mongoose.model("users",userSchema);

export {userDb}