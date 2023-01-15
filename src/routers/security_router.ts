import {Request, Response, Router} from "express";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {authRepository} from "../repositories/auth_repository";
import {authService} from "../domain/auth_service";
import {deviceIdConformityMiddleware} from "../middlewares/deviceIdConformity.middleware";
import {deviceViewType} from "../models/deviceViewModel";

export const securityRouter = Router();

securityRouter.get(
    "/",
    refreshTokenMiddleware,
    async (req: Request, res: Response<deviceViewType[] | string>) => {
        try {
            if (req.user) {
                const allDevices = await authRepository.findAllDevices(req.user.id);
                res.status(200).send(allDevices);
            }
        } catch (e) {
            res.status(500).send("securityRouter.get/" + e)
        }
    }
);
securityRouter.delete(
    "/",
    refreshTokenMiddleware,
    async (req: Request, res: Response<string>) => {
        try {
            if (req.user) {
                await authService.deleteAllRefreshTokenMetaByIdExceptMy(
                    req.user.id,
                    req.deviceId!
                );
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("securityRouter.delete/" + e)
        }
    }
);
securityRouter.delete(
    "/:deviceId",
    refreshTokenMiddleware,
    deviceIdConformityMiddleware,
    async (req: Request, res: Response<string>) => {
        try {
            const isDel = await authService.deleteRefreshTokenMetaByToken(
                req.params.deviceId
            );
            if (isDel) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("securityRouter.delete/:deviceId" + e)
        }
    }
);
