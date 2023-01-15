import {usersDbRepository} from "../repositories/users_db_repository";
import {usersService} from "./users_service";
import jwt from "jsonwebtoken";
import {settings} from "../settings/settings";
import bcrypt from "bcrypt";
import {userDbType} from "../models/userDBModel";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailAdapter} from "../adapters/email_adapter";
import {jwtService} from "../application/jwt_service";
import {authRepository} from "../repositories/auth_repository";
import {createNewConfirmationCode} from "../helpers/createNewConfirmationCode";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersDbRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return false;
        const salt = user.hash.slice(0, 29);
        const userHash = await usersService.generateHash(password, salt);
        if (user.hash === userHash) {
            return user;
        } else {
            return false;
        }
    },
    async createAccessToken(userID: string) {
        const token = jwt.sign({userId: userID}, settings.jwt_secretAT, {
            expiresIn: "10 seconds",
        });
        return {
            accessToken: token,
        };
    },
    async createRefreshToken(
        userId: string,
        ip: string,
        title: string | undefined
    ) {
        const deviceId = uuidv4();
        const token = await jwtService.createRefreshToken(userId, deviceId);
        const tokenInfo = await jwtService.decodeRefreshToken(token);
        await authRepository.createRefreshTokenMeta({
            deviceId,
            ip: ip,
            title: title,
            userId: userId,
            lastActiveDate: tokenInfo.iat!,
            expirationDate: tokenInfo.exp!,
        });
        return token;
    },
    async updateRefreshToken(userId: string, ip: string, deviceId: string) {
        const token = await jwtService.createRefreshToken(userId, deviceId);
        const tokenInfo = await jwtService.decodeRefreshToken(token);
        await authRepository.updateRefreshTokenMeta({
            deviceId: deviceId,
            ip: ip,
            lastActiveDate: tokenInfo.iat!,
            expirationDate: tokenInfo.exp!,
        });
        return token;
    },
    async getUserIdByAccessToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.jwt_secretAT);
            return result.userId;
        } catch (error) {
            console.log("Access Token error");
            return null;
        }
    },
    async deleteRefreshTokenMetaByToken(deviceId: string): Promise<boolean> {
        const isDelRT = await authRepository.deleteRefreshTokenMeta(deviceId);
        return isDelRT;
    },
    async deleteAllRefreshTokenMetaByIdExceptMy(
        userId: string,
        deviceId: string
    ): Promise<boolean> {
        const isDelRT = await authRepository.deleteALLRefreshTokenMetaByIdExceptMy(
            userId,
            deviceId
        );
        return isDelRT;
    },
    async createUser(
        login: string,
        password: string,
        email: string
    ): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await usersService.generateHash(
            password,
            passwordSalt
        );
        const newUser: userDbType = {
            login: login,
            email: email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed: false,
            },
        };
        const userId = await usersDbRepository.createUser(newUser);
        const fullUser = await usersDbRepository.findFullUserById(userId);
        try {
            await emailAdapter.sendRegistrationEmail(fullUser);
        } catch (error) {
            console.log(error);
            // await usersDbRepository.deleteUser(id)
        }
        return userId;
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersDbRepository.findUserByCode(code);
        return await usersDbRepository.updateConfirmation(user._id);
    },
    async checkEmailIsConfirmed(email: string) {
        const newEmailConfirmation = createNewConfirmationCode();
        const newUser =
            await usersDbRepository.findByEmailAndUpdateEmailConfirmation(
                email,
                newEmailConfirmation
            );
        try {
            return await emailAdapter.sendRegistrationEmail(newUser);
        } catch (error) {
            // await usersDbRepository.d.eleteUser(id)
        }
        return true;
    },
    async makeRecoveryCode(email: string) {
        const newEmailConfirmation = createNewConfirmationCode();
        const newUser =
            await usersDbRepository.findByEmailAndUpdateEmailConfirmation(
                email,
                newEmailConfirmation
            );
        try {
            return await emailAdapter.sendPasswordRecoveryEmail(newUser);
        } catch (error) {
            // await usersDbRepository.deleteUser(id)
        }
        return true;
    },
    async updatePasswordByRecoveryCode(code: string, password: string) {
        //const user = await usersDbRepository.findUserByCode(code);
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await usersService.generateHash(
            password,
            passwordSalt
        );
        await usersDbRepository.findByRecoveryCodeAndUpdatePasswordHash(code, passwordHash)
    }
};
