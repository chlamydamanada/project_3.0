import mongoose from "mongoose";

export const likeStatusSchema = new mongoose.Schema({
    entity: {type: String, required: true},
    entityId: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    status: {type: String, required: true},
    addedAt: {type: String, required: true},
})