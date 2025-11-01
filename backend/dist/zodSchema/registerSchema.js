"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    username: zod_1.z
        .string()
        .nonempty("Username is required")
        .min(3, "Username must be at least 3 char long"),
    password: zod_1.z
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 char long")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    confirmPassword: zod_1.z
        .string()
        .nonempty("Confirm password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
    .strict();
