import express from "express";
import { authRouter } from "./router/authRouter";
import { sweetRouter } from "./router/sweetRouter";

export const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/sweets", sweetRouter);
