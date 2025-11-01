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
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const db_1 = require("../utils/db");
const bcrypt_1 = require("bcrypt");
vitest_1.vi.mock("../utils/db", () => ({
    userModel: {
        findOne: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("bcrypt", () => ({
    hash: vitest_1.vi.fn(),
    compare: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)("testing register user end point", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("should return 400 if fields are missing ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({ username: "", password: "TestTest123", confirmPassword: "TestTest123@" });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/required/i);
    }));
    (0, vitest_1.it)("should return 400 if username is less than 3 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({ username: "ha", password: "123456@", confirmPassword: "123456@" });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/username.*3/i);
    }));
    (0, vitest_1.it)("should return 400 if passwords do not match", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({ username: "harsh", password: "TestTest123@", confirmPassword: "TestTest123" });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/Passwords do not match/i);
    }));
    (0, vitest_1.it)("should return 400 if password doesn't have special char", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({ username: "harsh", password: "TestTest123", confirmPassword: "TestTest123" });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/Password must contain a special character/i);
    }));
    (0, vitest_1.it)("should return 400 if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.userModel.findOne.mockResolvedValueOnce({ username: "testuser" });
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({
            username: "testuser",
            password: "Test@123",
            confirmPassword: "Test@123",
        });
        (0, vitest_1.expect)(res.statusCode).toBe(409);
        (0, vitest_1.expect)(res.body.message).toMatch(/already exists/i);
    }));
    (0, vitest_1.it)("should create user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.userModel.findOne.mockResolvedValueOnce(null);
        bcrypt_1.hash.mockResolvedValueOnce("hashedPassword@");
        db_1.userModel.create.mockResolvedValueOnce({
            _id: "1",
            username: "newuser",
        });
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/register")
            .send({
            username: "newuser",
            password: "Test@123",
            confirmPassword: "Test@123",
        });
        (0, vitest_1.expect)(res.statusCode).toBe(201);
        (0, vitest_1.expect)(res.body.message).toMatch(/success/i);
    }));
});
(0, vitest_1.describe)("testing login user endpoint", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("should return 400 if fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/login")
            .send({ username: "", password: "" });
        (0, vitest_1.expect)(res.statusCode).toBe(400);
        (0, vitest_1.expect)(res.body.message).toMatch(/required/i);
    }));
    (0, vitest_1.it)("should return 404 if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.userModel.findOne.mockResolvedValueOnce(null);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/login")
            .send({
            username: "nonexistent",
            password: "Test@123",
        });
        (0, vitest_1.expect)(res.statusCode).toBe(404);
        (0, vitest_1.expect)(res.body.message).toMatch(/not found/i);
    }));
    (0, vitest_1.it)("should return 401 if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.userModel.findOne.mockResolvedValueOnce({
            username: "testuser",
            password: "hashedPass",
        });
        bcrypt_1.compare.mockResolvedValueOnce(false);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/login")
            .send({
            username: "testuser",
            password: "wrongPass",
        });
        (0, vitest_1.expect)(res.statusCode).toBe(401);
        (0, vitest_1.expect)(res.body.message).toMatch(/invalid password/i);
    }));
    (0, vitest_1.it)("should return 200 and success message when credentials are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.userModel.findOne.mockResolvedValueOnce({
            _id: "123",
            username: "testuser",
            password: "hashedPass",
        });
        bcrypt_1.compare.mockResolvedValueOnce(true);
        const res = yield (0, supertest_1.default)(__1.app)
            .post("/api/auth/login")
            .send({
            username: "testuser",
            password: "Test@123",
        });
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res.body.message).toMatch(/login successful/i);
        (0, vitest_1.expect)(res.body).toHaveProperty("token");
    }));
});
