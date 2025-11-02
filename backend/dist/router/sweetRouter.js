"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sweetRouter = void 0;
const express_1 = require("express");
const sweetController_1 = require("../controllers/sweetController");
const userMiddleware_1 = require("../middleware/userMiddleware");
const adminRoleMiddleware_1 = require("../middleware/adminRoleMiddleware");
exports.sweetRouter = (0, express_1.Router)();
// sweets routes
exports.sweetRouter.post("/", userMiddleware_1.userMiddleware, (0, adminRoleMiddleware_1.adminRoleMiddleware)(), sweetController_1.addSweet);
exports.sweetRouter.get("/", userMiddleware_1.userMiddleware, sweetController_1.getSweets);
exports.sweetRouter.get("/search", userMiddleware_1.userMiddleware, sweetController_1.searchSweets);
exports.sweetRouter.put("/:id", userMiddleware_1.userMiddleware, (0, adminRoleMiddleware_1.adminRoleMiddleware)(), sweetController_1.updateSweet);
exports.sweetRouter.delete("/:id", userMiddleware_1.userMiddleware, (0, adminRoleMiddleware_1.adminRoleMiddleware)(), sweetController_1.deleteSweet);
// inventory routes
exports.sweetRouter.post("/:id/purchase", userMiddleware_1.userMiddleware, sweetController_1.purchaseSweet);
exports.sweetRouter.post("/:id/restock", userMiddleware_1.userMiddleware, adminRoleMiddleware_1.adminRoleMiddleware, sweetController_1.restockSweet);
