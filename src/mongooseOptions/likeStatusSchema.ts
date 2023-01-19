import mongoose from "mongoose";

export const likeStatusSchema = new mongoose.Schema({
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
    createdAt: {type: String, required: true},
})