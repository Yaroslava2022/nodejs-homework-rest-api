import express from "express";
import usersSchemas from "../../schemas/users-schemas.js";
import {validateBody} from "../../decorators/index.js";
import authController from "../../controllers/auth-controller.js";
import {authenticate, upload} from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/users/register", validateBody(usersSchemas.userSignupSchema), authController.signup);

authRouter.post("/users/login", validateBody(usersSchemas.userSigninSchema), authController.signin);
authRouter.patch("/users/avatars", authenticate, upload.single("avatar"), authController.updateAvatar
);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("/users/logout", authenticate, authController.logout);

export default authRouter;