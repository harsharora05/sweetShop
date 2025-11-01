import { NextFunction, Response } from "express";
import { myAuthRequest } from "../utils/requestInterface";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const userMiddleware = (req: myAuthRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "token missing" });
        }

        const token = header.split(" ")[1];
        const decoded = verify(token, JWT_SECRET as string) as {
            userId: string;
            role: string;
        };

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "invalid or expired token" });
    }
};