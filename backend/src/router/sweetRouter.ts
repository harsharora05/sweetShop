import { Router } from "express";
import { addSweet, deleteSweet, getSweets, purchaseSweet, restockSweet, searchSweets, updateSweet } from "../controllers/sweetController";
import { userMiddleware } from "../middleware/userMiddleware";
import { adminRoleMiddleware } from "../middleware/adminRoleMiddleware";

export const sweetRouter = Router();

// sweets routes
sweetRouter.post("/", userMiddleware, adminRoleMiddleware, addSweet)
sweetRouter.get("/", getSweets)
sweetRouter.get("/search", searchSweets)
sweetRouter.put("/:id", updateSweet)
sweetRouter.delete("/:id", deleteSweet)

// inventory routes
sweetRouter.post(":id/purchase", purchaseSweet)
sweetRouter.post(":id/restock", restockSweet)




