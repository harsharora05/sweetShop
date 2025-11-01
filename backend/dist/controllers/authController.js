"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = require("../utils/db");
const bcrypt_1 = require("bcrypt");
const registerSchema_1 = require("../zodSchema/registerSchema");
const loginSchema_1 = require("../zodSchema/loginSchema");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = registerSchema_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            const errorMessage = parsed.error.issues[0].message;
            return res.status(400).json({ message: errorMessage });
        }
        const { username, password } = parsed.data;
        const existingUser = yield db_1.userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        yield db_1.userModel.create({ username, password: hashedPassword });
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parseResult = loginSchema_1.loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            const message = ((_a = parseResult.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || "Invalid input";
            return res.status(400).json({ message });
        }
        const { username, password } = parseResult.data;
        const user = yield db_1.userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = (0, jsonwebtoken_1.sign)({
            userId: user._id,
            role: user.role
        }, config_1.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.login = login;
