import {ObjectId} from "mongodb";
import {postCreateServiceType} from "../models/postCreateModel";
import {likeStatusOfCommentsModel, likeStatusOfPostsModel, postsModel} from "./db";
import {injectable} from "inversify";
import {LikeStatusOfPostClass} from "../classes/LikeStatusOfPost";
@injectable()
export class PostsRepositoryClass {
    async deletePost(id: string): Promise<boolean> {
        let isDel = await postsModel.deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    }

    async createPost(post: postCreateServiceType): Promise<string> {
        const result = await postsModel.create(post);
        return result._id.toString();
    }

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<boolean> {
        const newPost = await postsModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                },
            }
        );
        return newPost.matchedCount === 1;
    }

    async findPost(id: string): Promise<boolean> {
        let post = await postsModel.findOne({_id: new ObjectId(id)});
        if (!post) {
            return false;
        } else {
            return true;
        }
    }

    async findStatusOfPost(postId: string, userId: string){
        const status = await likeStatusOfPostsModel.findOne({postId: postId, userId: userId});
        if (status) return status;
        if (!status) return undefined;
    }

    async createStatusOfPost(newStatus: LikeStatusOfPostClass){
        await likeStatusOfPostsModel.create(newStatus);
    }

    async updateStatusOfPost(postId: string, userId: string, status: string) {
        await likeStatusOfCommentsModel.updateOne({postId: postId, userId: userId}, {likeStatus: status})
    }
};
