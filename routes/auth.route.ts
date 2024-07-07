import express from "express";
import { login, register } from "../controllers/auth/auth.controller";
import { updateUserRole, userDetails } from "../controllers/user/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import validateRoute from "../middlewares/validateRoute.middleware";
import { loginValidator, signupValidator, validateUpdateUserRole } from "../validators/user.validator";
import { authLimiter } from "../utils/ratelimiters.utils";
import validateRole from "../middlewares/validateRole.middleware";

const authRouter = express.Router();
authRouter.post("/register", [authLimiter, validateRoute(signupValidator)], register);
authRouter.post("/login", [authLimiter, validateRoute(loginValidator)], login);
authRouter.get("/profile", isAuthenticated, userDetails);
authRouter.put("/profile/:id/role", [isAuthenticated, validateRole("admin"), validateRoute(validateUpdateUserRole)], updateUserRole);
export default authRouter