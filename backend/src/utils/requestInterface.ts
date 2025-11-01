import { Request } from "express";

export interface myAuthRequest extends Request {
    user?: { userId: string; role: string };
}