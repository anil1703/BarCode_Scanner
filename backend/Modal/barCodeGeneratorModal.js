import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_id:{
        type: String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    imageUrl : {
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }

})

const barCodeGenDb = mongoose.model("products",productSchema)

export {barCodeGenDb}