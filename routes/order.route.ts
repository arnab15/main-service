import express from "express";
import { getOrderById, getOrders, getUserOrders, placeOrder, updateOrderStatus } from "../controllers/order/order.controller";
import validateRoute from "../middlewares/validateRoute.middleware";
import { createOrderValidationSchema, updateOrderStatusValidationSchema } from "../validators/order.validator";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import validateRole from "../middlewares/validateRole.middleware";

const orderRouter = express.Router();
orderRouter.post("/", validateRoute(createOrderValidationSchema), isAuthenticated, placeOrder);
orderRouter.get("/", isAuthenticated, getUserOrders);
orderRouter.get("/all", [isAuthenticated, validateRole("admin")], getOrders);
orderRouter.get("/:id", isAuthenticated, getOrderById);
orderRouter.put("/:id", [validateRoute(updateOrderStatusValidationSchema), isAuthenticated, validateRole("admin")], updateOrderStatus);

export default orderRouter