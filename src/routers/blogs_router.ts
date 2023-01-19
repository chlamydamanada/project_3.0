import {Response, Router} from "express";
import {blogsService} from "../domain/blogs_service";
import {blogsQwRepository} from "../repositories/blogs_qwery_repo";
import {postsService} from "../domain/posts_service";
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithURL,
    RequestWithUrlAndBody,
    RequestWithUrlAndQuery,
} from "../models/request_types";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {shortDesValidation} from "../middlewares/shortDescription.middleware";
import {contentValidation} from "../middlewares/content.middleware";
import {titleValidation} from "../middlewares/title.middleware";
import {nameValidation} from "../middlewares/name.middleware";
import {descriptionValidation} from "../middlewares/description.middleware";
import {websiteValidation} from "../middlewares/website.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {blogUpdateType} from "../models/blogUpdateModel";
import {blogCreateType} from "../models/blogCreateModel";
import {blogViewType} from "../models/blogViewModel";
import {blogQueryType} from "../models/blogQueryModel";
import {postViewType} from "../models/postViewModel";
import {postQueryType} from "../models/postQueryModel";
import {postWithBlogIdCreteType} from "../models/postWithBlogIdCerateModel";
import {blogsViewType} from "../models/blogsViewModel";
import {postsViewType} from "../models/postsViewModel";

export const blogsRouter = Router();

class BlogsController {
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
            const blogs = await blogsQwRepository.findBlogs(
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
            let blog = await blogsQwRepository.findBlog(req.params.id);
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
            let isBlog = await blogsService.findBlog(req.params.id);
            if (!isBlog) {
                res.sendStatus(404);
            } else {
                await blogsService.deleteBlog(req.params.id);
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("blogsRouter.delete/:id" + e)
        }
    }

    async createBlog(req: RequestWithBody<blogCreateType>,
                     res: Response<blogViewType | string>) {
        try {
            const newBlog = await blogsService.createBlog(
                req.body.name,
                req.body.description,
                req.body.websiteUrl
            );
            res.status(201).send(newBlog);
        } catch (e) {
            res.status(500).send("blogsRouter.post/" + e)
        }
    }

    async createPostForBlog(
        req: RequestWithUrlAndBody<{ blogId: string }, postWithBlogIdCreteType>,
        res: Response<postViewType | string>
    ) {
        try {
            const getBlog = await blogsQwRepository.findBlog(req.params.blogId);
            if (!getBlog) {
                res.sendStatus(404);
            } else {
                const newPost = await postsService.createPost(
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

    async updateBlog(
        req: RequestWithUrlAndBody<{ id: string }, blogUpdateType>,
        res: Response<string>
    ) {
        try {
            let isBlog = await blogsService.findBlog(req.params.id);
            if (!isBlog) {
                res.sendStatus(404);
            } else {
                await blogsService.updateBlog(
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

    async getPostsByBlogId(
        req: RequestWithUrlAndQuery<{ blogId: string }, postQueryType>,
        res: Response<postsViewType | string>
    ) {
        try {
            const getBlog = await blogsService.findBlog(req.params.blogId);
            if (getBlog) {
                const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
                let sortField = sortBy ? sortBy : "createdAt";
                let pN = pageNumber ? +pageNumber : 1;
                let pS = pageSize ? +pageSize : 10;
                let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
                let postsByBlogId = await blogsQwRepository.findPostsById(
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

const blogsController = new BlogsController()
blogsRouter.get("/", blogsController.getAllUsers.bind(blogsController));
blogsRouter.get("/:id", blogsController.getBlogById.bind(blogsController));
blogsRouter.delete("/:id",
    baseAuthMiddleware,
    blogsController.deleteBlogById.bind(blogsController));
blogsRouter.post(
    "/",
    baseAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteValidation,
    inputValMiddleware,
    blogsController.createBlog.bind(blogsController));
blogsRouter.post(
    "/:blogId/posts/",
    baseAuthMiddleware,
    titleValidation,
    shortDesValidation,
    contentValidation,
    inputValMiddleware,
    blogsController.createPostForBlog.bind(blogsController));
blogsRouter.put(
    "/:id",
    baseAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteValidation,
    inputValMiddleware,
    blogsController.updateBlog.bind(blogsController));
blogsRouter.get(
    "/:blogId/posts",
    blogsController.getPostsByBlogId.bind(blogsController));
