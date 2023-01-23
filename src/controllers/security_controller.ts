import {AuthServiceClass} from "../domain/auth_service";
import {RequestWithURL, RequestWithUser, RequestWithUserAndDeviceId} from "../models/request_types";
import {userViewType} from "../models/userViewModel";
import {Response} from "express";
import {deviceViewType} from "../models/deviceViewModel";
import {inject, injectable} from "inversify";
@injectable()
export class SecurityController {
    constructor(@inject(AuthServiceClass) protected authService: AuthServiceClass) {
    }

    async getAllDevices(req: RequestWithUser<userViewType>,
                        res: Response<deviceViewType[] | string>) {
        try {
            if (req.user) {
                const allDevices = await this.authService.findAllDevices(req.user.id);
                res.status(200).send(allDevices);
            }
        } catch (e) {
            res.status(500).send("securityRouter.get/" + e)
        }
    }

    async deleteAllDevicesByIdExceptThis(req: RequestWithUserAndDeviceId<{ deviceId: string }, userViewType>,
                                         res: Response<string>) {
        try {
            if (req.user) {
                await this.authService.deleteAllRefreshTokenMetaByIdExceptMy(
                    req.user.id,
                    req.deviceId!
                );
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("securityRouter.delete/" + e)
        }
    }

    async deleteDeviceById(req: RequestWithURL<{ deviceId: string }>,
                           res: Response<string>) {
        try {
            const isDel = await this.authService.deleteRefreshTokenMetaByToken(
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

};