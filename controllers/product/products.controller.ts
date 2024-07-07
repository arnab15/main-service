import { Request, Response } from "express";
import logger from "../../logger";
import createHttpError from "http-errors";
import * as productService from "../../services/products/products.service";
import { ProductInput } from "../../validators/product.validator";

export const addNewProduct = async (req: Request<{}, {}, ProductInput["body"]>, res: Response) => {
    try {
        const product = await productService.addProduct(req.body);
        res.send(product);
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const existedProduct = await productService.getProductById(req.params.id);
        if (!existedProduct) {
            return res.status(404).send(createHttpError.NotFound("Product not found"));
        }
        const product = await productService.updateProduct(req.params.id, req.body);
        res.send(product);
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.send({
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const getProducts = async (req: Request<{ page: number, limit: number }>, res: Response) => {
    try {
        const products = await productService.getProducts({
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        });
        const count = await productService.countProducts();
        res.send({
            products,
            count
        });
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).send(createHttpError.NotFound("Product not found"));
        }
        res.send(product);
    } catch (error: any) {
        logger.error(error.message, error);
        res.status(500).send(createHttpError.InternalServerError());
    }
}