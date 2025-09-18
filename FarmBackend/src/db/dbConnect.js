import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//function to connnect our server to database
const dbConnect = async() =>{
    try {
        //mongoose instance is returned
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB Connection sucessfull ",)
    } catch (error) {
        throw new Error("Error occrued in DB connection ", error);
        // process.exit(1);
    }
}

export default dbConnect;

