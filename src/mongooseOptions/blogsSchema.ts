import mongoose from "mongoose";
import {blogDbModel} from "../models/blogDbModel";

export const blogsSchema = new mongoose.Schema<blogDbModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
})

