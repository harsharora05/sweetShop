import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "..";
import { userModel } from "../utils/db";
import { hash } from "bcrypt";

vi.mock("../utils/db", () => ({
    userModel: {
        findOne: vi.fn(),
        create: vi.fn(),
    },
}));

vi.mock("bcrypt", () => ({
    hash: vi.fn(),
}));


describe("testing register user end point", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("should return 400 if fields are missing ", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "", password: "TestTest123", confirmPassword: "TestTest123@" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/required/i)
    });


    it("should return 400 if username is less than 3 characters", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "ha", password: "123456@", confirmPassword: "123456@" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/username.*3/i);
    });


    it("should return 400 if passwords do not match", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "harsh", password: "TestTest123@", confirmPassword: "TestTest123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Passwords do not match/i);
    });


    it("should return 400 if password doesn't have special char", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "harsh", password: "TestTest123", confirmPassword: "TestTest123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Password must contain a special character/i);
    });


    it("should return 400 if user already exists", async () => {
        (userModel.findOne as any).mockResolvedValueOnce({ username: "testuser" });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "testuser",
                password: "Test@123",
                confirmPassword: "Test@123",
            });

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/already exists/i);
    });


    it("should create user successfully", async () => {
        (userModel.findOne as any).mockResolvedValueOnce(null);
        (hash as any).mockResolvedValueOnce("hashedPassword@");
        (userModel.create as any).mockResolvedValueOnce({
            _id: "1",
            username: "newuser",
        });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                username: "newuser",
                password: "Test@123",
                confirmPassword: "Test@123",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/success/i);
    });

});