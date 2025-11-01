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
const login = (req, res) => { };
exports.login = login;
