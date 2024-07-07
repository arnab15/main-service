import mongoose from "mongoose";
export interface OrderDocument extends mongoose.Document {
    products: string[];
    address: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    user: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
}
const orderSchema = new mongoose.Schema({
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema)