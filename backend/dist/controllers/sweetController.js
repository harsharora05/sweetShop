"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockSweet = exports.purchaseSweet = exports.deleteSweet = exports.updateSweet = exports.searchSweets = exports.getSweets = exports.addSweet = void 0;
const db_1 = require("../utils/db");
const addSweetSchema_1 = require("../zodSchema/addSweetSchema");
const addSweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parsed = addSweetSchema_1.addSweetSchema.safeParse(req.body);
        if (!parsed.success) {
            const message = ((_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || "invalid input";
            return res.status(400).json({ message });
        }
        const { name, category, price, quantity } = parsed.data;
        const sweet = yield db_1.sweetModel.create({
            name,
            category,
            price,
            quantity,
        });
        return res.status(201).json({ message: "sweet added successfully", sweet });
    }
    catch (err) {
        console.error("addSweet error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.addSweet = addSweet;
const getSweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sweets = yield db_1.sweetModel.find();
        return res.status(200).json({ sweets });
    }
    catch (err) {
        console.error("getSweets error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getSweets = getSweets;
const searchSweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, category, minPrice, maxPrice } = req.query;
        const filter = {};
        if (query) {
            filter.name = { $regex: query, $options: "i" };
        }
        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const sweets = yield db_1.sweetModel.find(filter);
        if (!sweets.length) {
            return res.status(404).json({ message: "No sweets found" });
        }
        return res.status(200).json({ sweets });
    }
    catch (err) {
        console.error("searchSweets error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.searchSweets = searchSweets;
const updateSweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = req.body;
        const sweet = yield db_1.sweetModel.findByIdAndUpdate(id, update, { new: true });
        if (!sweet)
            return res.status(404).json({ message: "Sweet not found" });
        return res.status(200).json({ message: "Sweet updated successfully", sweet });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.updateSweet = updateSweet;
const deleteSweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sweet = yield db_1.sweetModel.findByIdAndDelete(id);
        if (!sweet)
            return res.status(404).json({ message: "Sweet not found" });
        return res.status(200).json({ message: "Sweet deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
exports.deleteSweet = deleteSweet;
const purchaseSweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "quantity should be greater than 0" });
        }
        const sweet = yield db_1.sweetModel.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: "sweet not found" });
        }
        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: "not enough stock is available" });
        }
        sweet.quantity -= quantity;
        yield sweet.save();
        return res.status(200).json({
            message: `purchased ${quantity} ${sweet.name} successfully`,
            remaining: sweet.quantity,
        });
    }
    catch (err) {
        console.error("purchase sweet error:", err);
        return res.status(500).json({ message: "server error" });
    }
});
exports.purchaseSweet = purchaseSweet;
const restockSweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "quantity must be greater than 0" });
        }
        const sweet = yield db_1.sweetModel.findById(id);
        if (!sweet) {
            return res.status(404).json({ message: "sweet not found" });
        }
        sweet.quantity += quantity;
        yield sweet.save();
        return res.status(200).json({
            message: `restocked successfully}`,
            updatedQuantity: sweet.quantity,
        });
    }
    catch (err) {
        console.error("restock sweet error:", err);
        return res.status(500).json({ message: "server error" });
    }
});
exports.restockSweet = restockSweet;
