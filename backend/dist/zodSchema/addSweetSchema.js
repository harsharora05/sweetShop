"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSweetSchema = void 0;
const zod_1 = require("zod");
exports.addSweetSchema = zod_1.z
    .object({
    name: zod_1.z.string().nonempty("name is required").trim(),
    category: zod_1.z.string().nonempty("category is required").trim(),
    price: zod_1.z.coerce.number().int("Quantity must be an integer"),
    quantity: zod_1.z.coerce.number().int("Quantity must be an integer").min(1, "Quantity must be >= 0"),
});
