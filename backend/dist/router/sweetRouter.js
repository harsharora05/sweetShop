"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sweetRouter = void 0;
const express_1 = require("express");
const sweetController_1 = require("../controllers/sweetController");
exports.sweetRouter = (0, express_1.Router)();
// sweets routes
exports.sweetRouter.post("/", sweetController_1.addSweet);
exports.sweetRouter.get("/", sweetController_1.getSweets);
exports.sweetRouter.get("/search", sweetController_1.searchSweets);
exports.sweetRouter.put("/:id", sweetController_1.updateSweet);
exports.sweetRouter.delete("/:id", sweetController_1.deleteSweet);
// inventory routes
exports.sweetRouter.post(":id/purchase", sweetController_1.purchaseSweet);
exports.sweetRouter.post(":id/restock", sweetController_1.restockSweet);
