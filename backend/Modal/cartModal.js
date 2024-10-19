import mongoose from "mongoose";

const cartscheme = new mongoose.Schema({
    product_id :{
        type: String,
        required: true
    }
})

const cartDb = mongoose.model("cart",cartscheme);

export {cartDb}