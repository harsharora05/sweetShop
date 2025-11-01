import { Request, Response } from "express";
import { userModel } from "../utils/db";
import { hash } from "bcrypt";
import { registerSchema } from "../zodSchema/registerSchema";




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

export const login = (req: Request, res: Response) => { }
