import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "..";




describe("testing register user end point", () => {

    it("should return 400 if fields are missing ", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "", password: "TestTest123@", confirmPassword: "TestTest123@" });
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

});