import { Request, Response } from "express";
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




export const purchaseSweet = (req: myAuthRequest, res: Response) => { }
export const restockSweet = (req: myAuthRequest, res: Response) => { }