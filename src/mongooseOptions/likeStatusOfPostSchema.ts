import mongoose from "mongoose";

export const likeStatusOfPostSchema = new mongoose.Schema({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    likeStatus: {type: String, required: true},
    addedAt: {type: String, required: true},
})