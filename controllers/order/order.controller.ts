import { Request, Response } from "express";
import logger from "../../logger";
import createHttpError from "http-errors";
import { CreateOrderInput } from "../../validators/order.validator";
import * as orderService from "../../services/orders/orders.service";
import { getProductsDetails } from "../../services/products/products.service";
import { producePlaceOrder, produceUpdateOrderStatus } from "../../kafka/producer";
export const placeOrder = async (req: Request<{}, {}, CreateOrderInput["body"]>, res: Response) => {
    try {
        const { products, address } = req.body;
        const userId = req.user.id;
        const foundProducts = await getProductsDetails(products);
        if (foundProducts.length !== products.length) {
            return res.status(404).send(createHttpError.NotFound("Some products not found"));
        }
        const total = foundProducts.reduce((acc, product) => acc + product.price, 0);
        // @ts-ignore
        await producePlaceOrder({ products, address, user: userId, total });
        // const newOrder = await orderService.createOrder({ products, address, user: userId, total });
        return res.send({ message: "Order created successfully" });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}


export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { page, limit } = req.query;
        if (!page || !limit) {
            return res.status(400).send("Bad Request");
        }
        const orders = await orderService.getUserOrders({ userId, page: Number(page), limit: Number(limit) });
        const userOrderCount = await orderService.userOrderCount(userId);
        res.send({
            orders,
            count: userOrderCount
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await produceUpdateOrderStatus({ id, status });
        res.send({ message: "Order status updated successfully" });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        if (!order) {
            return res.status(404).send(createHttpError.NotFound("Order not found"));
        }
        res.send(order);
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query;
        if (!page || !limit) {
            return res.status(400).send(createHttpError.BadRequest("limit and page no are required"));
        }
        const orders = await orderService.getOrders({ page: Number(page), limit: Number(limit) });
        const totalOrdersCount = await orderService.totalOrdersCount();
        res.send({
            orders,
            count: totalOrdersCount
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}