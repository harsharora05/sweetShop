import { Request, Response } from "express";
import { userModel } from "../utils/db";
import { compare, hash } from "bcrypt";
import { registerSchema } from "../zodSchema/registerSchema";
import { loginSchema } from "../zodSchema/loginSchema";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";




export const register = async (req: Request, res: Response) => {
    try {

        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            const errorMessage = parsed.error.issues[0].message;
            return res.status(400).json({ message: errorMessage });
        }
        const { username, password } = parsed.data;

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = await hash(password, 10);

        await userModel.create({ username, password: hashedPassword });

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            const message = parseResult.error.issues[0]?.message || "Invalid input";
            return res.status(400).json({ message });
        }

        const { username, password } = parseResult.data;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = sign({
            userId: user._id,
            role: user.role
        }, JWT_SECRET as string);

        return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
