import express from "express";
import authRouter from "./auth.route";
import productRouter from "./product.route";
import orderRouter from "./order.route";

const mainRouter = express.Router();
mainRouter.use(authRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/orders", orderRouter);

export default mainRouter