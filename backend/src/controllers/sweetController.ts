import { Response } from "express";
import { myAuthRequest } from "../utils/requestInterface";
import { sweetModel } from "../utils/db";
import { addSweetSchema } from "../zodSchema/addSweetSchema";


export const addSweet = async (req: myAuthRequest, res: Response) => {
    try {
        const parsed = addSweetSchema.safeParse(req.body);

        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message || "invalid input";
            return res.status(400).json({ message });
        }

        const { name, category, price, quantity } = parsed.data;

        const sweet = await sweetModel.create({
            name,
            category,
            price,
            quantity,
        });

        return res.status(201).json({ message: "sweet added successfully", sweet });
    } catch (err) {
        console.error("addSweet error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getSweets = async (req: myAuthRequest, res: Response) => {
    try {
        const sweets = await sweetModel.find();
        return res.status(200).json({ sweets });
    } catch (err) {
        console.error("getSweets error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const searchSweets = async (req: myAuthRequest, res: Response) => {
    try {
        const { query, category, minPrice, maxPrice } = req.query;

        const filter: any = {};

        if (query) {
            filter.name = { $regex: query as string, $options: "i" };
        }

        if (category) {
            filter.category = { $regex: category as string, $options: "i" };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await sweetModel.find(filter);

        if (!sweets.length) {
            return res.status(404).json({ message: "No sweets found" });
        }

        return res.status(200).json({ sweets });
    } catch (err) {
        console.error("searchSweets error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


export const updateSweet = async (req: myAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const sweet = await sweetModel.findByIdAndUpdate(id, update, { new: true });

        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        return res.status(200).json({ message: "Sweet updated successfully", sweet });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const deleteSweet = async (req: myAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const sweet = await sweetModel.findByIdAndDelete(id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        return res.status(200).json({ message: "Sweet deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}




export const purchaseSweet = async (req: myAuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "quantity should be greater than 0" });
        }

        const sweet = await sweetModel.findById(id);

        if (!sweet) {
            return res.status(404).json({ message: "sweet not found" });
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: "not enough stock is available" });
        }

        sweet.quantity -= quantity;
        await sweet.save();

        return res.status(200).json({
            message: `purchased ${quantity} ${sweet.name} successfully`,
            remaining: sweet.quantity,
        });
    } catch (err) {
        console.error("purchase sweet error:", err);
        return res.status(500).json({ message: "server error" });
    }
}

export const restockSweet = (req: myAuthRequest, res: Response) => { }