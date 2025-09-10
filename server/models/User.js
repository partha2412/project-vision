import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})
const User =  mongoose.model("User",userSchema);

export default User;