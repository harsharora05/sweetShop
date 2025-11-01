import { verify } from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sweetModel } from "../utils/db";
import request from "supertest";
import { app } from "..";

vi.mock("../utils/db", () => ({
    sweetModel: {
        find: vi.fn(),
        create: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
    },
}));


vi.mock("jsonwebtoken", () => ({
    sign: vi.fn().mockReturnValue("mocked_token"),
    verify: vi.fn().mockReturnValue({ userId: "mockUserId", role: "ADMIN" }),
}));

describe("add sweet controller", () => {
    const mockAdminToken = "admin_token";
    const mockUserToken = "user_token";

    beforeEach(() => {
        vi.resetAllMocks();

        (verify as any).mockImplementation((token: string) => {
            if (token === "admin_token") {
                return { userId: "1", role: "ADMIN" };
            } else {
                return { userId: "2", role: "USER" };
            }
        });
    });

    it("should add a sweet if user is ADMIN", async () => {
        (sweetModel.create as any).mockResolvedValue({
            _id: "123",
            name: "Ladoo",
            category: "Indian",
            price: 100,
            quantity: 20
        });

        const res = await request(app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({
                name: "Ladoo",
                category: "Indian",
                price: 100,
                quantity: 20
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/successfully/i);
        expect(sweetModel.create).toHaveBeenCalled();
    });


    it("should deny access if user is not ADMIN", async () => {
        const res = await request(app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({
                name: "Barfi",
                category: "Indian",
                price: 80,
                quantity: 10
            });

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/access denied/i);
    });


    it("should return 400 if fields are missing", async () => {
        const res = await request(app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({
                name: "",
                category: "Indian",
                price: 100
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/required/i);
    });



    it("should return all sweets for logged-in users", async () => {
        (sweetModel.find as any).mockResolvedValue([
            { name: "Ladoo", category: "Indian", price: 100, quantity: 20 },
            { name: "Barfi", category: "Indian", price: 80, quantity: 15 }
        ]);

        const res = await request(app)
            .get("/api/sweets/")
            .set("Authorization", `Bearer ${mockUserToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.sweets).toHaveLength(2);
        expect(sweetModel.find).toHaveBeenCalled();
    });



    it("should allow ADMIN to update a sweet", async () => {
        (sweetModel.findByIdAndUpdate as any).mockResolvedValue({
            _id: "123",
            name: "Updated Ladoo",
            category: "Indian",
            price: 120,
            quantity: 10
        });

        const res = await request(app)
            .put("/api/sweets/123")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({ price: 120, quantity: 10 });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/updated/i);
    });



    it("should allow ADMIN to delete a sweet", async () => {
        (sweetModel.findByIdAndDelete as any).mockResolvedValue({ _id: "123" });

        const res = await request(app)
            .delete("/api/sweets/123")
            .set("Authorization", `Bearer ${mockAdminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});




describe("testing for sweets search endpoint", () => {
    const mockToken = "mock_token";

    beforeEach(() => {
        vi.resetAllMocks();
        (verify as any).mockReturnValue({ userId: "123", role: "USER" });
    });

    it("should search by name", async () => {
        (sweetModel.find as any).mockResolvedValue([
            { name: "Ladoo", category: "Indian", price: 100, quantity: 10 },
        ]);

        const res = await request(app)
            .get("/api/sweets/search?query=Ladoo")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.sweets).toHaveLength(1);
        expect(sweetModel.find).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.any(Object),
            })
        );
    });

    it("should search by category", async () => {
        (sweetModel.find as any).mockResolvedValue([
            { name: "Rasgulla", category: "Bengali", price: 80, quantity: 20 },
        ]);

        const res = await request(app)
            .get("/api/sweets/search?category=Bengali")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.sweets[0].category).toBe("Bengali");
    });

    it("should search by price range", async () => {
        (sweetModel.find as any).mockResolvedValue([
            { name: "Barfi", category: "Indian", price: 150 },
        ]);

        const res = await request(app)
            .get("/api/sweets/search?minPrice=100&maxPrice=200")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(200);
        expect(sweetModel.find).toHaveBeenCalledWith(
            expect.objectContaining({
                price: expect.objectContaining({
                    $gte: 100,
                    $lte: 200,
                }),
            })
        );
    });

    it("should return 404 if no sweets found", async () => {
        (sweetModel.find as any).mockResolvedValue([]);

        const res = await request(app)
            .get("/api/sweets/search?query=Chocolate")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/no sweets found/i);
    });

    it("should handle server error", async () => {
        (sweetModel.find as any).mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .get("/api/sweets/search?query=Ladoo")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toMatch(/server error/i);
    });
});