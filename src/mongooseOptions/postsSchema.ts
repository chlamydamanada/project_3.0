import mongoose from "mongoose";
import {postDbType} from "../models/postsDbModel";

export const postsSchema = new mongoose.Schema<postDbType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})