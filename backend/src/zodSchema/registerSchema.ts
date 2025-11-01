import { z } from "zod";

export const registerSchema = z
    .object({
        username: z
            .string()
            .nonempty("Username is required")
            .min(3, "Username must be at least 3 char long"),

        password: z
            .string()
            .nonempty("Password is required")
            .min(6, "Password must be at least 6 char long")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),

        confirmPassword: z
            .string()
            .nonempty("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .strict();
