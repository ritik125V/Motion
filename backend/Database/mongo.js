import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export async function connectDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB 🟢🟢🟢🟢🟢");
    } catch (error) {
        console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴")
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB;