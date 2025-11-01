import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "..";
import { userModel } from "../utils/db";
import { compare, hash } from "bcrypt";

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





describe("testing login user endpoint", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 if fields are missing", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: "", password: "" });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/required/i);
    });

    it("should return 404 if user does not exist", async () => {
        (userModel.findOne as any).mockResolvedValueOnce(null);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                username: "nonexistent",
                password: "Test@123",
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });


    it("should return 401 if password is incorrect", async () => {
        (userModel.findOne as any).mockResolvedValueOnce({
            username: "testuser",
            password: "hashedPass",
        });
        (compare as any).mockResolvedValueOnce(false);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                username: "testuser",
                password: "wrongPass",
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid password/i);
    });


    it("should return 200 and success message when credentials are correct", async () => {
        (userModel.findOne as any).mockResolvedValueOnce({
            _id: "123",
            username: "testuser",
            password: "hashedPass",
        });
        (compare as any).mockResolvedValueOnce(true);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                username: "testuser",
                password: "Test@123",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/login successful/i);
        expect(res.body).toHaveProperty("token");
    });
});
