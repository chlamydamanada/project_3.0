import {ObjectId} from "mongodb";
import {userAuthServiceType} from "../models/userAuthServiceModel";
import {userDbType} from "../models/userDBModel";
import {emailConfirmationType} from "../models/emailConfirmationServiceModel";
import {usersModel} from "./db";

 class UsersDbRepositoryClass  {
    async createUser(user: userDbType): Promise<string> {
        const newUser = await usersModel.create(user);
        return newUser._id.toString();
    }
    async deleteUser(id: string): Promise<boolean> {
        const isDel = await usersModel.deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    }
    async findUserById(id: string): Promise<boolean> {
        const isUser = await usersModel.findOne({_id: new ObjectId(id)});
        if (isUser) {
            return true;
        } else {
            return false;
        }
    }
    async findUserByLoginOrEmail(
        loginOrEmail: string
    ): Promise<userAuthServiceType | undefined> {
        const user = await usersModel.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
        if (user) {
            return {
                id: user._id.toString(),
                email: user.email,
                hash: user.passwordHash,
                emailConfirmation: user.emailConfirmation,
            };
        } else {
            return undefined;
        }
    }
    async findFullUserById(id: string): Promise<any> {
        const fullUser = await usersModel.findOne({_id: new ObjectId(id)});
        if (fullUser) {
            return fullUser;
        }
    }
    async findUserByCode(code: string): Promise<any> {
        const user = await usersModel.findOne({
            "emailConfirmation.confirmationCode": code,
        });
        if (user) {
            return user;
        } else {
            return false;
        }
    }
    async updateConfirmation(_id: ObjectId): Promise<boolean> {
        const result = await usersModel.updateOne(
            {_id},
            {$set: {"emailConfirmation.isConfirmed": true}}
        );
        return result.matchedCount === 1;
    }
    async findByEmailAndUpdateEmailConfirmation(
        email: string,
        newEmailConfirmation: emailConfirmationType
    ): Promise<any> {
        const newUser = await usersModel.findOneAndUpdate(
            {email: email},
            {$set: {emailConfirmation: newEmailConfirmation}},
            {returnDocument: "after"}
        );
        return newUser;
    }
    async findByRecoveryCodeAndUpdatePasswordHash(code: string, passwordHash: string) {
        await usersModel.findOneAndUpdate(
            {"emailConfirmation.confirmationCode": code},
            {$set: {passwordHash: passwordHash}},
            {returnDocument: "after"}
        );
    }
};
export const usersDbRepository = new UsersDbRepositoryClass();