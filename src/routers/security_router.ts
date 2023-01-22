import {Router} from "express";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {deviceIdConformityMiddleware} from "../middlewares/deviceIdConformity.middleware";
import {securityController} from "../composition_root";

export const securityRouter = Router();

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
