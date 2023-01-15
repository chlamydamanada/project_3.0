import {Request, Response, Router} from "express";
import {RequestWithBody} from "../models/request_types";
import {authService} from "../domain/auth_service";
import {loginOrEmailValidation} from "../middlewares/auth_loginOrEmail.middleware";
import {passwordValidation} from "../middlewares/password.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {userCreateType} from "../models/userCreateModel";
import {emailValidation} from "../middlewares/email.middleware";
import {loginValidation} from "../middlewares/login.middleware";
import {codeValidation} from "../middlewares/code.middleware";
import {emailExistValidation} from "../middlewares/emailExist.middleware";
import {emailIsConfirmedValidation} from "../middlewares/emailIsConfirmed.middleware";
import {loginExistValidation} from "../middlewares/loginExist.middleware";
import {meViewType} from "../models/meViewModel";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {
    limiterLogin, limiterNewPassword, limiterPasswordRecovery,
    limiterRegistration,
    limiterRegistrationConfirmation,
    limiterRegistrationEmailResending,
} from "../middlewares/limitRegistration.middleware";
import {usersDbRepository} from "../repositories/users_db_repository";

export const authRouter = Router();

authRouter.post(
    "/login",
    limiterLogin,
    loginOrEmailValidation,
    passwordValidation,
    inputValMiddleware,
    async (req: Request, res: Response<{ accessToken: string } | string>) => {
        try {
            const user = await authService.checkCredentials(
                req.body.loginOrEmail,
                req.body.password
            );
            if (user) {
                const accessToken = await authService.createAccessToken(user.id);
                const refreshToken = await authService.createRefreshToken(
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
);

authRouter.post(
    "/refresh-token",
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        try {
            if (req.user) {
                const accessToken = await authService.createAccessToken(req.user.id);
                const refreshToken = await authService.updateRefreshToken(
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
);
authRouter.post(
    "/logout",
    refreshTokenMiddleware,
    async (req: Request, res: Response) => {
        try {
            await authService.deleteRefreshTokenMetaByToken(req.deviceId!);
            res.clearCookie("refreshToken").sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/logout" + e)
        }
    }
);
authRouter.get(
    "/me",
    bearerAuthMiddleware,
    async (req: Request, res: Response<meViewType | string>) => {
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
);
authRouter.post(
    "/registration",
    limiterRegistration,
    passwordValidation,
    loginValidation,
    loginExistValidation,
    emailValidation,
    emailExistValidation,
    inputValMiddleware,
    async (req: RequestWithBody<userCreateType>, res: Response) => {
        try {
            await authService.createUser(
                req.body.login,
                req.body.password,
                req.body.email
            );
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/registration" + e)
        }
    }
);
authRouter.post(
    "/registration-confirmation",
    limiterRegistrationConfirmation,
    codeValidation,
    inputValMiddleware,
    async (req: RequestWithBody<{ code: string }>, res: Response) => {
        try {
            const isConfirmed = await authService.confirmEmail(req.body.code);
            if (isConfirmed) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/registration-confirmation" + e)
        }
    }
);

authRouter.post(
    "/registration-email-resending",
    limiterRegistrationEmailResending,
    emailValidation,
    emailIsConfirmedValidation,
    inputValMiddleware,
    async (req: RequestWithBody<{ email: string }>, res: Response) => {
        try {
            const result = await authService.checkEmailIsConfirmed(req.body.email);
            if (result) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("authRouter.post/registration-email-resending" + e)
        }
    }
);
authRouter.post("/password-recovery",
    limiterPasswordRecovery,
    emailValidation,
    async (req: Request, res: Response) => {
        try {
            const user = await usersDbRepository.findUserByLoginOrEmail(req.body.email)
            if (user) {
                await authService.checkEmailIsConfirmed(req.body.email);
            }
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/password-recovery" + e)
        }
    });
authRouter.post("/new-password",
    limiterNewPassword,
    codeValidation,
    passwordValidation,
    async (req: Request, res: Response) => {
        try {
            await authService.updatePasswordByRecoveryCode(
                req.body.recoveryCode,
                req.body.newPassword)
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("authRouter.post/new-password" + e)
        }
    });
