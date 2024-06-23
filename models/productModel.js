import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    description:{
        type:String
    },
    model:{
        type:String,
    },
    type:{
        type:String
    },
    price:{
        type:String
    },
    offer:{
        type:String
    },
    image:{
        type:String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model('products', productSchema)