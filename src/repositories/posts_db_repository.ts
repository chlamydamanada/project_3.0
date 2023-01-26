import {ObjectId} from "mongodb";
import {postCreateServiceType} from "../models/postCreateModel";
import {likeStatusModel, postsModel} from "./db";
import {injectable} from "inversify";
import {LikeStatusOfPostClass} from "../classes/LikeStatusOfPost";
import {likeStatusDbType} from "../models/likeStatusOfCommentDbModel";
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

    async findStatusOfPost(postId: string, entity: string, userId: string){
        const status = await likeStatusModel.findOne({entityId: postId, entity:entity, userId: userId});
        if (status) return status;
        if (!status) return undefined;
    }

    async createStatusOfPost(newStatus: likeStatusDbType){
        await likeStatusModel.create(newStatus);
    }

    async updateStatusOfPost(postId: string, entity: string, userId: string, status: string) {
        await likeStatusModel.updateOne({entityId: postId, entity:entity, userId: userId}, {status: status})
    }
};
