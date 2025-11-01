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
(0, vitest_1.describe)("testing register user end point", () => {
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
});
