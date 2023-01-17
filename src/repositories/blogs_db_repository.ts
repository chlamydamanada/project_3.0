import {ObjectId} from "mongodb";
import {blogViewType} from "../models/blogViewModel";
import {blogCreateServiceType} from "../models/blogCreateModel";
import {BlogsModel} from "./db";

export const blogsRepository = {
    async findBlog(id: string): Promise<boolean> {
        let blog = await BlogsModel.findOne({_id: new ObjectId(id)});
        if (!blog) {
            return false;
        } else {
            return true;
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const isDel = await BlogsModel.deleteOne({_id: new ObjectId(id)});
        return isDel.deletedCount === 1;
    },
    async createBlog(blog: blogCreateServiceType): Promise<blogViewType> {
        const newBlog = await BlogsModel.create(blog);

        return {
            id: newBlog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
        };
    },
    async updateBlog(
        id: string,
        name: string,
        description: string,
        websiteUrl: string
    ): Promise<boolean> {
        const newBlog = await BlogsModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                },
            }
        );
        return newBlog.matchedCount === 1;
    },
};
