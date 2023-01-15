import mongoose, {Schema} from "mongoose";
import {userDbType} from "../models/userDBModel";

export const usersSchema = new mongoose.Schema<userDbType>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {type: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    }, required: true}
})