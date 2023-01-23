import {Router} from "express";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {deviceIdConformityMiddleware} from "../middlewares/deviceIdConformity.middleware";
import {container} from "../composition_root";
import {SecurityController} from "../controllers/security_controller";

export const securityRouter = Router();

const securityController = container.resolve(SecurityController);

securityRouter.get(
    "/",
    refreshTokenMiddleware,
    securityController.getAllDevices.bind(securityController));
securityRouter.delete(
    "/",
    refreshTokenMiddleware,
    securityController.deleteAllDevicesByIdExceptThis.bind(securityController));
securityRouter.delete(
    "/:deviceId",
    refreshTokenMiddleware,
    deviceIdConformityMiddleware,
    securityController.deleteDeviceById.bind(securityController));
