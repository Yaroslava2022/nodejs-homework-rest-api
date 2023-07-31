import express from "express";
import usersSchemas from "../../schemas/users-schemas.js";
import {validateBody} from "../../decorators/index.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post("/users/register", validateBody(usersSchemas.userSignupSchema), authController.signup);

authRouter.post("/users/login", validateBody(usersSchemas.userSigninSchema), authController.signin);

export default authRouter;