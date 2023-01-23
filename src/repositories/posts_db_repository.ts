import {ObjectId} from "mongodb";
import {postCreateServiceType} from "../models/postCreateModel";
import {postsModel} from "./db";
import {injectable} from "inversify";
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
};
