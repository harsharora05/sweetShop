import { model, Schema } from "mongoose";


const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now }
});



export const userModel = model('Users', userSchema);