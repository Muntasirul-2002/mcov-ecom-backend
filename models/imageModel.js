import mongoose from "mongoose";
const ImageUpload = new mongoose.Schema({
    image:{
        type:String
    }
})

export default mongoose.model('ImageUpload', ImageUpload)