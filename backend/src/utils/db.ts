import { model, Schema } from "mongoose";


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    created: { type: Date, default: Date.now }
});


const sweetSchema = new Schema({
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 0 }
})


export const sweetModel = model('Sweet', sweetSchema)
export const userModel = model('Users', userSchema);