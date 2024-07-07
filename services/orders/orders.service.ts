import { OrderDocument, OrderModel } from "../../models/Order.model";

export const createOrder = async (order: Omit<OrderDocument, "createdAt" | "updatedAt">) => {
    const newOrder = new OrderModel(order);
    return newOrder.save();
}

export const updateOrderStatus = async (id: string, status: OrderDocument["status"]) => {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true })
}


export const getUserOrders = async ({ page = 1, limit = 10, userId }: { page: number, limit: number, userId: string }) => {
    const skip = (page - 1) * limit;
    return OrderModel.find({ user: userId }).populate("products", "name price").sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export const userOrderCount = async (userId: string) => {
    return OrderModel.countDocuments({ user: userId });
}

export const getOrderById = async (id: string) => {
    return OrderModel.findById(id).populate("products", "name price");
}

export const getOrders = async ({ page = 1, limit = 10 }: { page: number, limit: number }) => {
    const skip = (page - 1) * limit;
    return OrderModel.find().populate("products", "name price").sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export const totalOrdersCount = async () => {
    return OrderModel.countDocuments();
}