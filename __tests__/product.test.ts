import superTest from "supertest"
import createServer from "../utils/creteServer"
const app = createServer()
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { addProduct } from "../services/products/products.service"
import { signJwtToken } from "../utils/jwt.utils"
import * as userService from "../services/users/users.service"
import { hashPassword } from "../utils/password.utils"
import { getUser } from "./utils/test.utils"
const productPayload = {
    name: "Galactic Bowling",
    description: "Galactic Bowling is an exaggerated and stylized bowling game with an intergalactic twist.",
    price: 200,
    category: "bowling"
}

describe("Product", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri())
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    describe("get product route", () => {
        describe("given product not exist", () => {
            it("should return product not exist", async () => {
                const productId = "6686762c268df1e8824c86af"
                const res = await superTest(app).get(`/api/products/${productId}`)
                console.log(res.body)
                expect(res.status).toBe(404)
            })
        })
        describe("given product exist", () => {
            it("should return product exist", async () => {
                const product = await addProduct(productPayload);
                const productId = product._id
                const { statusCode, body } = await superTest(app).get(`/api/products/${productId}`)
                console.log(body)
                expect(statusCode).toBe(200)
                expect(body.name).toBe(productPayload.name)
                const receivedId = body._id
                expect(`${productId}`).toBe(`${receivedId}`)
            })
        })

    })
    describe("create product route", () => {
        describe("given the user is not logged in", () => {
            it("should return 401", async () => {
                const { statusCode, body } = await superTest(app).post("/api/products").send(productPayload)
                expect(statusCode).toBe(401)
            })
        })
        describe("given non admin can not add a product", () => {
            it("should return 403", async () => {
                //@ts-ignore
                const user = await userService.addUser({
                    name: "Arnab Sahoo",
                    email: "arnabsahoo@me.com",
                    password: await hashPassword("123456")
                })
                const authToken = signJwtToken({ id: user._id })

                const { statusCode, body } = await superTest(app).post("/api/products").set("Authorization", `Bearer ${authToken}`).send(productPayload)
                expect(statusCode).toBe(403)
            })
        })
        describe("given admin can add a product", () => {
            it("should return added product", async () => {
                const adminUser = await getUser("admin")
                const authToken = signJwtToken({ id: adminUser._id })
                const { statusCode, body } = await superTest(app).post("/api/products").set("Authorization", `Bearer ${authToken}`).send(productPayload)
                expect(statusCode).toBe(200)
                expect(body.name).toBe(productPayload.name)
            })
        })

    })
    describe("update product route", () => {
        describe("given the user is not logged in", () => {
            it("should return 401", async () => {
                const productId = "6686762c268df1e8824c86af"
                const { statusCode } = await superTest(app).put(`/api/products/${productId}`).send(productPayload)
                expect(statusCode).toBe(401)
            })
        })
        describe("given non admin can not update a product", () => {
            it("should return 403", async () => {
                //@ts-ignore
                const user = await getUser("user")

                const product = await addProduct(productPayload);

                const authToken = signJwtToken({ id: user._id });
                const updatedProductPayload = {
                    name: "Galactic Bowling 2",
                    description: "Galactic Bowling 2 is an exaggerated and stylized bowling game with an intergalactic twist.",
                    price: 200,
                    category: "bowling"
                }
                const { statusCode, body } = await superTest(app).put(`/api/products/${product._id}`).set("Authorization", `Bearer ${authToken}`).send(updatedProductPayload)
                expect(statusCode).toBe(403)
            })
        })
        describe("given admin can update a product", () => {
            it("should return updated product", async () => {
                const adminUser = await getUser("admin")
                const product = await addProduct(productPayload);
                const productId = product._id;
                const authToken = signJwtToken({ id: adminUser._id });
                const updatedProductPayload = {
                    name: "Galactic Bowling 2",
                    description: "Galactic Bowling 2 is an exaggerated and stylized bowling game with an intergalactic twist.",
                    price: 200,
                    category: "bowling"
                }
                const { statusCode, body } = await superTest(app).put(`/api/products/${productId}`).set("Authorization", `Bearer ${authToken}`).send(updatedProductPayload)
                expect(statusCode).toBe(200)
                expect(body.name).toEqual(updatedProductPayload.name)

            })
        })

    })
    describe("delete product route", () => {
        describe("given non admin can not delete a product", () => {
            it("should return 403", async () => {
                //@ts-ignore
                const user = await getUser("user")
                const product = await addProduct(productPayload);
                const authToken = signJwtToken({ id: user._id });
                const { statusCode, body } = await superTest(app).delete(`/api/products/${product._id}`).set("Authorization", `Bearer ${authToken}`)
                expect(statusCode).toBe(403)
            })
        })
        describe("given admin can delete a product", () => {
            it("should return product deleted message", async () => {
                const adminUser = await getUser("admin")
                const product = await addProduct(productPayload);
                const authToken = signJwtToken({ id: adminUser._id });
                const { statusCode, body } = await superTest(app).delete(`/api/products/${product._id}`).set("Authorization", `Bearer ${authToken}`)
                expect(statusCode).toBe(200)
                expect(body.message).toEqual("Product deleted successfully")
            })
        })

    })
})