import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const url = process.env.MONGO_URL;

const connectToDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected !!");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        process.exit(1); // stop app if DB not connected
    }
};

export default connectToDB;
