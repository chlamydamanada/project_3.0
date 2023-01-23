import {ObjectId} from "mongodb";
import {blogViewType} from "../models/blogViewModel";
import {blogsViewType} from "../models/blogsViewModel";
import {sortingQueryFields} from "../helpers/sortingFields";
import {BlogsModel, postsModel} from "./db";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";
import {postsViewType} from "../models/postsViewModel";
import {postViewType} from "../models/postViewModel";
import {mappers} from "../helpers/mappers";
import {injectable} from "inversify";
@injectable()
export class BlogsQwRepositoryClass {
    async findBlogs(
        searchNameTerm: string | undefined,
        pN: number,
        pS: number,
        sortField: string,
        sD: 1 | -1
    ): Promise<blogsViewType> {
        const searchValue = sortingQueryFields.nameFilter(searchNameTerm);
        const totalCount = await BlogsModel.count(searchValue);
        const blogs = await BlogsModel
            .find(searchValue)
            .sort({[sortField]: sD})
            .skip((pN - 1) * pS)
            .limit(pS)
            .lean();
        const items: blogViewType[] = mappers.blogsMapper(blogs);
        const result = getArrayWithPagination(totalCount,
            pS,
            pN,
            items);
        return result;
    }

    async findBlog(id: string): Promise<blogViewType | undefined> {
        const blog = await BlogsModel.findOne({_id: new ObjectId(id)});
        if (!blog) return undefined;
        const result = mappers.blogMapper(blog);
        return result;
    }

    async findPostsById(
        blogId: string,
        pN: number,
        pS: number,
        sortField: string,
        sD: 1 | -1
    ): Promise<postsViewType> {
        let totalCount = await postsModel.count({blogId: blogId});
        let posts = await postsModel
            .find({blogId: blogId})
            .sort({[sortField]: sD})
            .skip((pN - 1) * pS)
            .limit(pS)
            .lean();
        const items: postViewType[] = mappers.postsMapper(posts);
        const result =  getArrayWithPagination(
            totalCount,
            pS,
            pN,
            items)
        return result;
    }
};

