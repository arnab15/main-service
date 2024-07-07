import superTest from "supertest"
import createServer from "../utils/creteServer"
const app = createServer()
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { addProduct } from "../services/products/products.service"
import { signJwtToken } from "../utils/jwt.utils"
import { getUser } from "./utils/test.utils"
import { createOrder } from "../services/orders/orders.service"
const productPayload = {
    name: "Galactic Bowling",
    description: "Galactic Bowling is an exaggerated and stylized bowling game with an intergalactic twist.",
    price: 200,
    category: "bowling"
}

describe("Orders", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri())
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })
    describe("place order route", () => {
        describe("given the user is not logged in", () => {
            it("should return 401", async () => {
                const product1 = new mongoose.Types.ObjectId().toHexString();
                const product2 = new mongoose.Types.ObjectId().toHexString();

                const { statusCode } = await superTest(app).post(`/api/orders`).send({
                    products: [product1, product2],
                    address: "test address"
                })
                expect(statusCode).toBe(401)
            })
        })
        describe("given order product not exist", () => {
            it("should return 400 product not exist error", async () => {
                const product1 = new mongoose.Types.ObjectId().toHexString()
                const product2 = new mongoose.Types.ObjectId().toHexString()
                const user = await getUser("user")
                const authToken = signJwtToken({ id: user._id });
                const { statusCode, body } = await superTest(app).post(`/api/orders`).set("Authorization", `Bearer ${authToken}`).send({
                    products: [product1, product2],
                    address: "test address"
                })
                expect(statusCode).toBe(404)
                expect(body.message).toBe("Some products not found")
            })
        })
        describe("given user can place order", () => {
            it("should return order placed", async () => {
                const product = await addProduct(productPayload)
                const user = await getUser("user")
                const authToken = signJwtToken({ id: user._id });
                const { statusCode, body } = await superTest(app).post(`/api/orders`).set("Authorization", `Bearer ${authToken}`).send({
                    products: [product._id],
                    address: "test address"
                })
                console.log(body)
                expect(statusCode).toBe(200)
                expect(body.message).toBe("Order created successfully")
            })
        })
    })
    describe("get user order route", () => {
        describe("given the user is not logged in for get order", () => {
            it("should return 401", async () => {
                const { statusCode } = await superTest(app).get(`/api/orders`);
                expect(statusCode).toBe(401)
            })
        })
        describe("given user can get his order history", () => {
            it("should return placed orders", async () => {
                const product = await addProduct(productPayload)
                const user = await getUser("user")
                if (user && product) {
                    //@ts-ignore
                    const order = await createOrder({ user: user._id, products: [product._id], address: "test address" })
                    const authToken = signJwtToken({ id: user._id });
                    const { statusCode, body } = await superTest(app).get(`/api/orders?page=1&limit=10`).set("Authorization", `Bearer ${authToken}`);
                    console.log(body)
                    expect(statusCode).toBe(200)
                    expect(body.orders.length).toBeGreaterThan(0)
                }

            })
        })
    })
    describe("get order by id route", () => {
        describe("given the user is not logged in for get order by id", () => {
            it("should return 401", async () => {
                const orderId = new mongoose.Types.ObjectId().toString()
                const { statusCode } = await superTest(app).get(`/api/orders/${orderId}`);
                expect(statusCode).toBe(401)
            })
        })
        describe("given order does not exist", () => {
            it("should return 404", async () => {
                const orderId = new mongoose.Types.ObjectId().toString()
                const user = await getUser("user")
                const authToken = signJwtToken({ id: user._id });
                const { statusCode } = await superTest(app).get(`/api/orders/${orderId}`).set("Authorization", `Bearer ${authToken}`);
                expect(statusCode).toBe(404)
            })
        })
        describe("given user can get his order history", () => {
            it("should return placed orders", async () => {
                const product = await addProduct(productPayload)
                const user = await getUser("user")
                if (user && product) {
                    //@ts-ignore
                    const order = await createOrder({ user: user._id, products: [product._id], address: "test address" })
                    const authToken = signJwtToken({ id: user._id });
                    const { statusCode, body } = await superTest(app).get(`/api/orders?page=1&limit=10`).set("Authorization", `Bearer ${authToken}`);
                    console.log(body)
                    expect(statusCode).toBe(200)
                    expect(body.orders.length).toBeGreaterThan(0)
                }

            })
        })
    })
    describe("update order status by admin", () => {
        describe("given the user is not logged in for get order by id", () => {
            it("should return 401", async () => {
                const orderId = new mongoose.Types.ObjectId().toString()
                const { statusCode } = await superTest(app).put(`/api/orders/${orderId}`).send({ status: "delivered" });
                expect(statusCode).toBe(401)
            })
        })
        describe("given non admin can not update order status", () => {
            it("should return 403", async () => {
                //@ts-ignore
                const user = await getUser("user")
                const authToken = signJwtToken({ id: user._id });
                const orderId = new mongoose.Types.ObjectId().toString()
                const { statusCode } = await superTest(app).put(`/api/orders/${orderId}`).set("Authorization", `Bearer ${authToken}`).send({ status: "delivered" });
                expect(statusCode).toBe(403)
            })
        })
        describe("given admin can update order status", () => {
            it("should return product deleted message", async () => {
                const user = await getUser("admin")
                const product = await addProduct(productPayload);
                if (user && product) {
                    //@ts-ignore
                    const order = await createOrder({ user: user._id, products: [product._id], address: "test address" })
                    const authToken = signJwtToken({ id: user._id });
                    const { statusCode, body } = await superTest(app).put(`/api/orders/${order._id}`).set("Authorization", `Bearer ${authToken}`).send({ status: "delivered" });
                    expect(statusCode).toBe(200)
                    expect(body.message).toBe("Order status updated successfully")
                }

            })
        })

    })
    describe("get all orders for admin", () => {
        describe("given non admin can not fetch all orders", () => {
            it("should return 403", async () => {
                //@ts-ignore
                const user = await getUser("user")
                const authToken = signJwtToken({ id: user._id });
                const { statusCode } = await superTest(app).get(`/api/orders/all?page=1&limit=10`).set("Authorization", `Bearer ${authToken}`)
                expect(statusCode).toBe(403)
            })
        })
        describe("given admin can fetch all orders", () => {
            it("should return product deleted message", async () => {
                const user = await getUser("admin")
                const product = await addProduct(productPayload);
                if (user && product) {
                    //@ts-ignore
                    await createOrder({ user: user._id, products: [product._id], address: "test address" })
                    const authToken = signJwtToken({ id: user._id });
                    const { statusCode, body } = await superTest(app).get(`/api/orders/all?page=1&limit=10`).set("Authorization", `Bearer ${authToken}`)
                    expect(statusCode).toBe(200)
                    expect(body.orders.length).toBeGreaterThan(0)
                    expect(body.count).toBeGreaterThan(0)
                }

            })
        })

    })
})