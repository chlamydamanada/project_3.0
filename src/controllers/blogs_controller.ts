import {BlogsService} from "../domain/blogs_service";
import {BlogsQwRepositoryClass} from "../repositories/blogs_qwery_repo";
import {PostsService} from "../domain/posts_service";
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithURL,
    RequestWithUrlAndBody,
    RequestWithUrlAndQuery
} from "../models/request_types";
import {blogQueryType} from "../models/blogQueryModel";
import {Response} from "express";
import {blogsViewType} from "../models/blogsViewModel";
import {blogViewType} from "../models/blogViewModel";
import {blogCreateType} from "../models/blogCreateModel";
import {postWithBlogIdCreteType} from "../models/postWithBlogIdCerateModel";
import {postViewType} from "../models/postViewModel";
import {blogUpdateType} from "../models/blogUpdateModel";
import {postQueryType} from "../models/postQueryModel";
import {postsViewType} from "../models/postsViewModel";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) protected blogsService: BlogsService,
                @inject(BlogsQwRepositoryClass) protected blogsQwRepository: BlogsQwRepositoryClass,
                @inject(PostsService) protected postsService: PostsService) {
    }

    async getAllUsers(
        req: RequestWithQuery<blogQueryType>,
        res: Response<blogsViewType | string>
    ) {
        try {
            const {sortBy, pageNumber, pageSize, searchNameTerm, sortDirection} =
                req.query;
            let sortField = sortBy ? sortBy : "createdAt";
            let pN = pageNumber ? +pageNumber : 1;
            let pS = pageSize ? +pageSize : 10;
            let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
            const blogs = await this.blogsQwRepository.findBlogs(
                searchNameTerm,
                pN,
                pS,
                sortField,
                sD
            );
            res.status(200).send(blogs);
        } catch (e) {
            res.status(500).send("blogsRouter.get/" + e)
        }
    }

    async getBlogById(req: RequestWithURL<{ id: string }>,
                      res: Response<blogViewType | string>) {
        try {
            let blog = await this.blogsQwRepository.findBlog(req.params.id);
            if (!blog) {
                res.sendStatus(404);
            }
            res.status(200).send(blog);
        } catch (e) {
            res.status(500).send("blogsRouter.get/:id" + e)
        }
    }

    async deleteBlogById(req: RequestWithURL<{ id: string }>, res: Response<string>) {
        try {
            let isBlog = await this.blogsService.findBlog(req.params.id);
            if (!isBlog) {
                res.sendStatus(404);
            } else {
                await this.blogsService.deleteBlog(req.params.id);
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("blogsRouter.delete/:id" + e)
        }
    }

    async createBlog(req: RequestWithBody<blogCreateType>,
                     res: Response<blogViewType | string>) {
        try {
            const newBlog = await this.blogsService.createBlog(
                req.body.name,
                req.body.description,
                req.body.websiteUrl
            );
            res.status(201).send(newBlog);
        } catch (e) {
            res.status(500).send("blogsRouter.post/" + e)
        }
    }

    async createPostForBlog(req: RequestWithUrlAndBody<{ blogId: string }, postWithBlogIdCreteType>,
                            res: Response<postViewType | string>) {
        try {
            const getBlog = await this.blogsQwRepository.findBlog(req.params.blogId);
            if (!getBlog) {
                res.sendStatus(404);
            } else {
                const newPost = await this.postsService.createPost(
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content,
                    req.params.blogId,
                    getBlog.name
                );
                res.status(201).send(newPost);
            }
        } catch (e) {
            res.status(500).send("blogsRouter.post/:blogId/posts" + e)
        }
    }

    async updateBlog(req: RequestWithUrlAndBody<{ id: string }, blogUpdateType>,
                     res: Response<string>) {
        try {
            let isBlog = await this.blogsService.findBlog(req.params.id);
            if (!isBlog) {
                res.sendStatus(404);
            } else {
                await this.blogsService.updateBlog(
                    req.params.id,
                    req.body.name,
                    req.body.description,
                    req.body.websiteUrl
                );

                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("blogsRouter.put/:id" + e)
        }
    }

    async getPostsByBlogId(req: RequestWithUrlAndQuery<{ blogId: string }, postQueryType>,
                           res: Response<postsViewType | string>) {
        try {
            const getBlog = await this.blogsService.findBlog(req.params.blogId);
            if (getBlog) {
                const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
                let sortField = sortBy ? sortBy : "createdAt";
                let pN = pageNumber ? +pageNumber : 1;
                let pS = pageSize ? +pageSize : 10;
                let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
                let postsByBlogId = await this.blogsQwRepository.findPostsById(
                    req.params.blogId,
                    pN,
                    pS,
                    sortField,
                    sD
                );
                res.status(200).send(postsByBlogId);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(500).send("blogsRouter.get/:blogId/posts" + e)
        }
    }
}