import * as dotenv from "dotenv";
import mongoose from "mongoose"
import {blogsSchema} from "../mongooseOptions/blogsSchema";
import {usersSchema} from "../mongooseOptions/usersSchema";
import {postsSchema} from "../mongooseOptions/postsSchema";
import {commentsSchema} from "../mongooseOptions/commentsSchema";
import {refreshTokenMetaSchema} from "../mongooseOptions/refreshTokenMetaSchema";
import {likeStatusSchema} from "../mongooseOptions/likeStatusSchema";


dotenv.config();

const mongoUrl: any = process.env.MONGO_URL;


export const BlogsModel = mongoose.model("blogs", blogsSchema);
export const postsModel = mongoose.model("posts", postsSchema);
export const usersModel = mongoose.model("users", usersSchema);
export const commentsModel = mongoose.model("comments", commentsSchema);
export const refreshTokenMetaModel = mongoose.model("refreshTokenMeta", refreshTokenMetaSchema);
export const likeStatusModel = mongoose.model("likeStatus", likeStatusSchema);


export async function runDb() {
    try {
        await mongoose.connect(mongoUrl)
        console.log("Connected successfully to mongoDB server");
    } catch (error) {
        console.log("Can't connect to mongo server", error);
        await mongoose.disconnect();
    }
}







