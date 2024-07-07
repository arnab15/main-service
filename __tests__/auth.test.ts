import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import createServer from "../utils/creteServer";
import { getUser } from "./utils/test.utils";

const app = createServer()
describe("Auth", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri())
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    describe("signup route", () => {
        describe("given user already signed up", () => {
            it("should return user already exist", async () => {
                const user = await getUser("user");
                if (user) {
                    const res = await supertest(app).post(`/api/register`).send({
                        email: user.email,
                        name: user.name,
                        password: "123456"
                    })
                    expect(res.status).toBe(409)
                    expect(res.body.message).toBe("User already exists")
                }

            })
        })

        describe("given user not signed up", () => {
            it("should return signed up user", async () => {
                const user = await getUser("user");
                if (user) {
                    const { statusCode, body } = await supertest(app).post(`/api/register`).send({
                        email: "9s9kV@example.com",
                        name: "Arnab Sahoo",
                        password: "123456"
                    })
                    expect(statusCode).toBe(201)
                    expect(body.token).toBeTruthy();
                }
            })
        })

    })
    describe("login route", () => {
        describe("given user not signed up yet", () => {
            it("should return 404", async () => {
                const { statusCode } = await supertest(app).post(`/api/login`).send({
                    email: "arnab@example.com",
                    password: "123456"
                })
                expect(statusCode).toBe(404)
            }
            )
        })

        describe("given user not signed up", () => {
            it("should return signed up user", async () => {
                const user = await getUser("user");
                if (user) {
                    const { statusCode, body } = await supertest(app).post(`/api/login`).send({
                        email: user.email,
                        password: "123456"
                    })
                    expect(statusCode).toBe(200)
                    expect(body.token).toBeTruthy();
                }
            })
        })

    })

})