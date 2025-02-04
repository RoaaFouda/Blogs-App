import mongoose from "mongoose";


const connectDb = async () => {
    try{
        const mongooseUri = process.env.MONGODB_URI;
        if (!mongooseUri) {
           throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(mongooseUri);
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;