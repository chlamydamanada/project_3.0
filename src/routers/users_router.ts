import {Router} from "express";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {passwordValidation} from "../middlewares/password.middleware";
import {loginValidation} from "../middlewares/login.middleware";
import {emailValidation} from "../middlewares/email.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {userController} from "../composition_root";

export const usersRouter = Router();

usersRouter.get(
    "/",
    baseAuthMiddleware,
    userController.getAllUsers.bind(userController));
usersRouter.post(
    "/",
    baseAuthMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValMiddleware,
    userController.createUser.bind(userController));
usersRouter.delete(
    "/:id",
    baseAuthMiddleware,
    inputValMiddleware,
    userController.deleteUserById.bind(userController));
