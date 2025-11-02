import { Router } from "express";
import { addSweet, deleteSweet, getSweets, purchaseSweet, restockSweet, searchSweets, updateSweet } from "../controllers/sweetController";
import { userMiddleware } from "../middleware/userMiddleware";
import { adminRoleMiddleware } from "../middleware/adminRoleMiddleware";

export const sweetRouter = Router();

// sweets routes
sweetRouter.post("/", userMiddleware, adminRoleMiddleware, addSweet)
sweetRouter.get("/", userMiddleware, getSweets)
sweetRouter.get("/search", userMiddleware, searchSweets)
sweetRouter.put("/:id", userMiddleware, adminRoleMiddleware, updateSweet)
sweetRouter.delete("/:id", userMiddleware, adminRoleMiddleware, deleteSweet)

// inventory routes
sweetRouter.post("/:id/purchase", userMiddleware, purchaseSweet)
sweetRouter.post("/:id/restock", userMiddleware, adminRoleMiddleware, restockSweet)




