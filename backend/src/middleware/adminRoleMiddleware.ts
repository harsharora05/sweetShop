import { Response, NextFunction } from "express";
import { myAuthRequest } from "../utils/requestInterface";

export const adminRoleMiddleware = () => {
    return (req: myAuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "access denied" });
        }
        next();
    };
};