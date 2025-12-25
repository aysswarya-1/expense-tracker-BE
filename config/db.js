import mongoose, { Mongoose } from "mongoose"

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("Error connect to MOngoDB", error)
        process.exit(1)
    }
}

export default ConnectDB;