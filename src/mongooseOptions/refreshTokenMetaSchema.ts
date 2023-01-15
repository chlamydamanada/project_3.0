import mongoose from "mongoose";
import {refreshTokenMetaDBType} from "../models/refreshTokenMetaModel";

export const refreshTokenMetaSchema = new mongoose.Schema<refreshTokenMetaDBType>({
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    userId: {type: String, required: true},
    lastActiveDate: {type: Number, required: true},
    expirationDate: {type: Number, required: true}
})

