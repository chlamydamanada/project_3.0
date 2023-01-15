import mongoose from "mongoose";
import {commentDbType} from "../models/commentDbModel";

export const commentsSchema = new mongoose.Schema<commentDbType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
})