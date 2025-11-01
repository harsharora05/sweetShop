import { model, Schema } from "mongoose";


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    created: { type: Date, default: Date.now }
});



export const userModel = model('Users', userSchema);