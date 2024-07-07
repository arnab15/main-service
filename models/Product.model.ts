import mongoose from "mongoose";
export interface ProductDocument extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema)