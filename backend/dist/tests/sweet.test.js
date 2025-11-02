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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const vitest_1 = require("vitest");
const db_1 = require("../utils/db");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
vitest_1.vi.mock("../utils/db", () => ({
    sweetModel: {
        find: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        findByIdAndUpdate: vitest_1.vi.fn(),
        findByIdAndDelete: vitest_1.vi.fn(),
        save: vitest_1.vi.fn(),
        findById: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("jsonwebtoken", () => ({
    sign: vitest_1.vi.fn().mockReturnValue("mocked_token"),
    verify: vitest_1.vi.fn().mockReturnValue({ userId: "mockUserId", role: "ADMIN" }),
}));
(0, vitest_1.describe)("tests for sweets endpoint to add update and delete", () => {
    const mockAdminToken = "admin_token";
    const mockUserToken = "user_token";
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
        jsonwebtoken_1.verify.mockImplementation((token) => {
            if (token === "admin_token") {
                return { userId: "1", role: "ADMIN" };
            }
            else {
                return { userId: "2", role: "USER" };
            }
        });
    });
    (0, vitest_1.it)("should add a sweet if user is ADMIN", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.create.mockResolvedValue({
            _id: "123",
            name: "Ladoo",
            category: "Indian",
            price: 100,
            quantity: 20
        });
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({
            name: "Ladoo",
            category: "Indian",
            price: 100,
            quantity: 20
        });
        (0, vitest_1.expect)(res.statusCode).toBe(201);
        (0, vitest_1.expect)(res.body.message).toMatch(/successfully/i);
        (0, vitest_1.expect)(db_1.sweetModel.create).toHaveBeenCalled();
    }));
    (0, vitest_1.it)("should deny access if user is not ADMIN", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({
            name: "Barfi",
            category: "Indian",
            price: 80,
            quantity: 10
        });
        (0, vitest_1.expect)(res.statusCode).toBe(403);
        (0, vitest_1.expect)(res.body.message).toMatch(/access denied/i);
    }));
    (0, vitest_1.it)("should return 400 if fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({
            name: "",
            category: "Indian",
            price: 100
        });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/required/i);
    }));
    (0, vitest_1.it)("should return all sweets for logged-in users", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockResolvedValue([
            { name: "Ladoo", category: "Indian", price: 100, quantity: 20 },
            { name: "Barfi", category: "Indian", price: 80, quantity: 15 }
        ]);
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/")
            .set("Authorization", `Bearer ${mockUserToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.sweets).toHaveLength(2);
        (0, vitest_1.expect)(db_1.sweetModel.find).toHaveBeenCalled();
    }));
    (0, vitest_1.it)("should allow ADMIN to update a sweet", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.findByIdAndUpdate.mockResolvedValue({
            _id: "123",
            name: "Updated Ladoo",
            category: "Indian",
            price: 120,
            quantity: 10
        });
        const res = yield (0, supertest_1.default)(__1.app)
            .put("/api/sweets/123")
            .set("Authorization", `Bearer ${mockAdminToken}`)
            .send({ price: 120, quantity: 10 });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/updated/i);
    }));
    (0, vitest_1.it)("should allow ADMIN to delete a sweet", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.findByIdAndDelete.mockResolvedValue({ _id: "123" });
        const res = yield (0, supertest_1.default)(__1.app)
            .delete("/api/sweets/123")
            .set("Authorization", `Bearer ${mockAdminToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/deleted/i);
    }));
});
(0, vitest_1.describe)("tests for sweets search endpoint", () => {
    const mockToken = "mock_token";
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
        jsonwebtoken_1.verify.mockReturnValue({ userId: "123", role: "USER" });
    });
    (0, vitest_1.it)("should search by name", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockResolvedValue([
            { name: "Ladoo", category: "Indian", price: 100, quantity: 10 },
        ]);
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/search?query=Ladoo")
            .set("Authorization", `Bearer ${mockToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.sweets).toHaveLength(1);
        (0, vitest_1.expect)(db_1.sweetModel.find).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            name: vitest_1.expect.any(Object),
        }));
    }));
    (0, vitest_1.it)("should search by category", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockResolvedValue([
            { name: "Rasgulla", category: "Bengali", price: 80, quantity: 20 },
        ]);
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/search?category=Bengali")
            .set("Authorization", `Bearer ${mockToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.sweets[0].category).toBe("Bengali");
    }));
    (0, vitest_1.it)("should search by price range", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockResolvedValue([
            { name: "Barfi", category: "Indian", price: 150 },
        ]);
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/search?minPrice=100&maxPrice=200")
            .set("Authorization", `Bearer ${mockToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(db_1.sweetModel.find).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            price: vitest_1.expect.objectContaining({
                $gte: 100,
                $lte: 200,
            }),
        }));
    }));
    (0, vitest_1.it)("should return 404 if no sweets found", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/search?query=Chocolate")
            .set("Authorization", `Bearer ${mockToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/no sweets found/i);
    }));
    (0, vitest_1.it)("should handle server error", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.find.mockRejectedValue(new Error("DB error"));
        const res = yield (0, supertest_1.default)(__1.app)
            .get("/api/sweets/search?query=Ladoo")
            .set("Authorization", `Bearer ${mockToken}`);
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res.body.message).toMatch(/server error/i);
    }));
});
(0, vitest_1.describe)("tests for sweets purchase endpoint", () => {
    const mockToken = "user_token";
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetAllMocks();
        jsonwebtoken_1.verify.mockReturnValue({ userId: "1", role: "USER" });
    });
    (0, vitest_1.it)("should return 400 if quantity is missing or invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/purchase")
            .set("Authorization", `Bearer ${mockToken}`)
            .send({ quantity: 0 });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/greater than 0/i);
    }));
    (0, vitest_1.it)("should return 404 if sweet is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/purchase")
            .set("Authorization", `Bearer ${mockToken}`)
            .send({ quantity: 2 });
        (0, vitest_1.expect)(res.statusCode).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/not found/i);
    }));
    (0, vitest_1.it)("should return 400 if stock is insufficient", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.findById.mockResolvedValue({
            _id: "123",
            name: "Ladoo",
            quantity: 1,
            save: vitest_1.vi.fn(),
        });
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/purchase")
            .set("Authorization", `Bearer ${mockToken}`)
            .send({ quantity: 5 });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/not enough stock/i);
    }));
    (0, vitest_1.it)("should successfully purchase sweets and decrease quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSave = vitest_1.vi.fn().mockResolvedValue(true);
        db_1.sweetModel.findById.mockResolvedValue({
            _id: "123",
            name: "Ladoo",
            quantity: 10,
            save: mockSave,
        });
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/purchase")
            .set("Authorization", `Bearer ${mockToken}`)
            .send({ quantity: 3 });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/purchased/i);
        (0, vitest_1.expect)(res.body.remaining).toBe(7);
        (0, vitest_1.expect)(mockSave).toHaveBeenCalled();
    }));
});
(0, vitest_1.describe)("tests for restock sweet endpoint", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        jsonwebtoken_1.verify.mockReturnValue({ userId: "1", role: "ADMIN" });
    });
    (0, vitest_1.it)("should return 400 if quantity is missing or invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/restock")
            .set("Authorization", "Bearer faketoken")
            .send({ quantity: 0 });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/greater than 0/i);
    }));
    (0, vitest_1.it)("should return 404 if sweet not found", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.sweetModel.findById.mockResolvedValueOnce(null);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/123/restock")
            .set("Authorization", "Bearer faketoken")
            .send({ quantity: 10 });
        (0, vitest_1.expect)(res.statusCode).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/not found/i);
    }));
    (0, vitest_1.it)("should restock sweet and increase quantity", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSweet = {
            _id: "1",
            name: "Ladoo",
            quantity: 5,
            save: vitest_1.vi.fn().mockResolvedValue(true),
        };
        db_1.sweetModel.findById.mockResolvedValueOnce(mockSweet);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/sweets/1/restock")
            .set("Authorization", "Bearer faketoken")
            .send({ quantity: 5 });
        (0, vitest_1.expect)(mockSweet.quantity).toBe(10);
        (0, vitest_1.expect)(mockSweet.save).toHaveBeenCalled();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/restocked/i);
    }));
});
