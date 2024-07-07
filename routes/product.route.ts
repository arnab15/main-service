import express from "express";
import { addNewProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product/products.controller";
import validateRoute from "../middlewares/validateRoute.middleware";
import { productSchema, updateProductValidationSchema } from "../validators/product.validator";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import validateRole from "../middlewares/validateRole.middleware";
import { productRateLimiter } from "../utils/ratelimiters.utils";

const productRouter = express.Router();
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", [productRateLimiter, isAuthenticated, validateRole("admin"), validateRoute(productSchema)], addNewProduct);
productRouter.put("/:id", [productRateLimiter, isAuthenticated, validateRole("admin"), validateRoute(updateProductValidationSchema)], updateProduct);//TODO: Add middleware to check if user has admin access to update product
productRouter.delete("/:id", [productRateLimiter, isAuthenticated, validateRole("admin")], deleteProduct);
export default productRouter;