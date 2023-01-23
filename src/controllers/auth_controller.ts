import {AuthServiceClass} from "../domain/auth_service";
import {
    RequestWithBody,
    RequestWithDeviceId,
    RequestWithUser,
    RequestWithUserAndDeviceId
} from "../models/request_types";
import {loginCreateType} from "../models/loginCreateModel";
import {Response} from "express";
import {userViewType} from "../models/userViewModel";
import {meViewType} from "../models/meViewModel";
import {userCreateType} from "../models/userCreateModel";
import {newPasswordCreateType} from "../models/newPasswordCreateModel";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController {
    constructor(@inject(AuthServiceClass) protected authService: AuthServiceClass) {
    }

    async login(req: RequestWithBody<loginCreateType>,
                res: Response<{ accessToken: string } | string>) {
        try {
            const user = await this.authService.checkCredentials(
                req.body.loginOrEmail,
                req.body.password
            );
            if (user) {
                const accessToken = await this.authService.createAccessToken(user.id);
                const refreshToken = await this.authService.createRefreshToken(
                    user.id,
                    req.ip!,
                    req.headers["user-agent"]
                );
                console.log(refreshToken);
                res
                    .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                    })
                    .status(200)
                    .send(accessToken);
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/login" + e)
        }
    }

    async createNewTokens(req: RequestWithUserAndDeviceId<{ deviceId: string }, userViewType>,
                          res: Response<{ accessToken: string } | string>) {
        try {
            if (req.user) {
                const accessToken = await this.authService.createAccessToken(req.user.id);
                const refreshToken = await this.authService.updateRefreshToken(
                    req.user.id,
                    req.ip!,
                    req.deviceId!
                );
                console.log(refreshToken);
                res
                    .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true,
                    })
                    .status(200)
                    .send(accessToken);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/refresh-token" + e)
        }
    }

    async logout(req: RequestWithDeviceId<{ deviceId: string }>,
                 res: Response<string>) {
        try {
            await this.authService.deleteRefreshTokenMetaByToken(req.deviceId!);
            res.clearCookie("refreshToken").sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/logout" + e)
        }
    }

    async me(req: RequestWithUser<userViewType>,
             res: Response<meViewType | string>) {
        try {
            if (req.user) {
                const me: meViewType = {
                    email: req.user.email,
                    login: req.user.login,
                    userId: req.user.id,
                };

                res.status(200).send(me);
            }
        } catch (e) {
            res.status(500).send("authRouter.get/me" + e)
        }
    }

    async registration(req: RequestWithBody<userCreateType>,
                       res: Response<string>) {
        try {
            await this.authService.createUser(
                req.body.login,
                req.body.password,
                req.body.email
            );
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/registration" + e)
        }
    }

    async registrationConfirmation(req: RequestWithBody<{ code: string }>,
                                   res: Response<string>) {
        try {
            const isConfirmed = await this.authService.confirmEmail(req.body.code);
            if (isConfirmed) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/registration-confirmation" + e)
        }
    }

    async registrationEmailResending(req: RequestWithBody<{ email: string }>,
                                     res: Response<string>) {
        try {
            const result = await this.authService.checkEmailIsConfirmed(req.body.email);
            if (result) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/registration-email-resending" + e)
        }
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>,
                           res: Response<string>) {
        try {
            const user = await this.authService.findUserByLoginOrEmail(req.body.email)
            if (user) {
                await this.authService.makeRecoveryCode(req.body.email);
            }
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/password-recovery" + e)
        }
    }

    async newPassword(req: RequestWithBody<newPasswordCreateType>,
                      res: Response<string>) {
        try {
            await this.authService.updatePasswordByRecoveryCode(
                req.body.recoveryCode,
                req.body.newPassword)
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/new-password" + e)
        }
    }

}