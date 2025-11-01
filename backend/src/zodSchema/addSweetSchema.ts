import { z } from "zod";

export const addSweetSchema = z
    .object({
        name: z.string().nonempty("name is required").trim(),
        category: z.string().nonempty("category is required").trim(),
        price: z.coerce.number().int("Quantity must be an integer"),
        quantity: z.coerce.number().int("Quantity must be an integer").min(1, "Quantity must be >= 0"),
    });