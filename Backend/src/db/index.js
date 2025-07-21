import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)   //process.env.MONGODB_URI taken from .env and take db name from constants file
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);  //when mongoose is stored in a varaible , it gives object in which .connection show connection and.host show host as objects
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)    //process is taken from nodejs and uses the current thing , exit(1) is used for process failure
    }
}

export default connectDB