import { ProductModel } from "../../models/Product.model";
import { ProductInput } from "../../validators/product.validator";

export const addProduct = async (product: ProductInput["body"]) => {
    const newProduct = new ProductModel(product);
    return newProduct.save();
}


export const updateProduct = async (id: string, product: ProductInput["body"]) => {
    return ProductModel.findByIdAndUpdate(id, product, { new: true })
}


export const getProducts = async ({ page = 1, limit = 10 }: { page: number, limit: number }) => {
    const skip = (page - 1) * limit;
    return ProductModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export const getProductById = async (id: string) => {
    return ProductModel.findById(id);
}

export const deleteProduct = async (id: string) => {
    return ProductModel.findByIdAndDelete(id);
}

export const countProducts = async () => {
    return ProductModel.countDocuments();
}

export const getProductsDetails = (ids: string[]) => {
    return ProductModel.find({ _id: { $in: ids } });
}