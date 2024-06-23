import mongoose from "mongoose";

const createDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Database Connected to ${conn.connection.host}`)

    } catch (error) {
        console.log(error)
    }
}

export default createDB;