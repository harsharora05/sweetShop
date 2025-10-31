import { Router } from "express";
import { addSweet, deleteSweet, getSweets, purchaseSweet, restockSweet, searchSweets, updateSweet } from "../controllers/sweetController";

export const sweetRouter = Router();

// sweets routes
sweetRouter.post("/", addSweet)
sweetRouter.get("/", getSweets)
sweetRouter.get("/search", searchSweets)
sweetRouter.put("/:id", updateSweet)
sweetRouter.delete("/:id", deleteSweet)

// inventory routes
sweetRouter.post(":id/purchase", purchaseSweet)
sweetRouter.post(":id/restock", restockSweet)




