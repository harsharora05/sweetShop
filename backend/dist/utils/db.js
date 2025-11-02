"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.sweetModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    created: { type: Date, default: Date.now }
});
const sweetSchema = new mongoose_1.Schema({
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 0 }
});
exports.sweetModel = (0, mongoose_1.model)('Sweet', sweetSchema);
exports.userModel = (0, mongoose_1.model)('Users', userSchema);
