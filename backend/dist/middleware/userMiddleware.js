"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const userMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "token missing" });
        }
        const token = header.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
