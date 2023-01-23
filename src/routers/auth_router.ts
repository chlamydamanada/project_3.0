import {Router} from "express";
import {loginOrEmailValidation} from "../middlewares/auth_loginOrEmail.middleware";
import {newPasswordValidation, passwordValidation} from "../middlewares/password.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {emailValidation} from "../middlewares/email.middleware";
import {loginValidation} from "../middlewares/login.middleware";
import {codeValidation, recoveryCodeValidation} from "../middlewares/code.middleware";
import {emailExistValidation} from "../middlewares/emailExist.middleware";
import {emailIsConfirmedValidation} from "../middlewares/emailIsConfirmed.middleware";
import {loginExistValidation} from "../middlewares/loginExist.middleware";
import {refreshTokenMiddleware} from "../middlewares/refreshToken.middleware";
import {
    limiterLogin,
    limiterNewPassword,
    limiterPasswordRecovery,
    limiterRegistration,
    limiterRegistrationConfirmation,
    limiterRegistrationEmailResending,
} from "../middlewares/limitRegistration.middleware";
import {container} from "../composition_root";
import {AuthController} from "../controllers/auth_controller";

export const authRouter = Router();

const authController = container.resolve(AuthController);

authRouter.post(
    "/login",
    limiterLogin,
    loginOrEmailValidation,
    passwordValidation,
    inputValMiddleware,
    authController.login.bind(authController));

authRouter.post(
    "/refresh-token",
    refreshTokenMiddleware,
    authController.createNewTokens.bind(authController));
authRouter.post(
    "/logout",
    refreshTokenMiddleware,
    authController.logout.bind(authController));
authRouter.get(
    "/me",
    bearerAuthMiddleware,
    authController.me.bind(authController));
authRouter.post(
    "/registration",
    limiterRegistration,
    passwordValidation,
    loginValidation,
    loginExistValidation,
    emailValidation,
    emailExistValidation,
    inputValMiddleware,
    authController.registration.bind(authController));
authRouter.post(
    "/registration-confirmation",
    limiterRegistrationConfirmation,
    codeValidation,
    inputValMiddleware,
    authController.registrationConfirmation.bind(authController));

authRouter.post(
    "/registration-email-resending",
    limiterRegistrationEmailResending,
    emailValidation,
    emailIsConfirmedValidation,
    inputValMiddleware,
    authController.registrationEmailResending.bind(authController));
authRouter.post("/password-recovery",
    limiterPasswordRecovery,
    emailValidation,
    inputValMiddleware,
    authController.passwordRecovery.bind(authController));
authRouter.post("/new-password",
    limiterNewPassword,
    recoveryCodeValidation,
    newPasswordValidation,
    inputValMiddleware,
    authController.newPassword.bind(authController));
