import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstant =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstant.connection.host}`)
    } catch (error) {
        console.log("Mongo DB connection failed and here error is", error)
        process.exit(1)
    }
}

export default connectDB