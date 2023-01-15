import {Response, Router} from "express";
import {postsService} from "../domain/posts_service";
import {postsQwRepository} from "../repositories/posts_qwery_repo";
import {blogsQwRepository} from "../repositories/blogs_qwery_repo";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {blogIdValidation} from "../middlewares/blogId.middleware";
import {titleValidation} from "../middlewares/title.middleware";
import {shortDesValidation} from "../middlewares/shortDescription.middleware";
import {contentValidation} from "../middlewares/content.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithURL,
    RequestWithUrlAndBody,
    RequestWithUrlAndQuery,
} from "../models/request_types";
import {postQueryType} from "../models/postQueryModel";
import {postViewType} from "../models/postViewModel";
import {postCreateType} from "../models/postCreateModel";
import {postUpdateType} from "../models/postUpdateModel";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {commentsService} from "../domain/comments_service";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {commentsQweryRepository} from "../repositories/comments_qwery_repository";
import {commentViewType} from "../models/commentViewModel";
import {postsViewType} from "../models/postsViewModel";
import {commentsViewType} from "../models/commentsViewModel";

export const postsRouter = Router();

postsRouter.get(
    "/",
    async (req: RequestWithQuery<postQueryType>,
           res: Response<postsViewType | string>) => {
        try {
            const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
            let sortField: string = sortBy ? sortBy : "createdAt";
            let pN = pageNumber ? +pageNumber : 1;
            let pS = pageSize ? +pageSize : 10;
            let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
            const posts = await postsQwRepository.findPosts(pN, pS, sortField, sD);
            res.status(200).send(posts);
        } catch (e) {
            res.status(500).send("postsRouter.get/" + e)
        }
    }
);
postsRouter.get(
    "/:id",
    async (req: RequestWithURL<{ id: string }>,
           res: Response<postViewType | string>) => {
        try {
            let post = await postsQwRepository.findPost(req.params.id);
            if (!post) {
                res.sendStatus(404);
            } else {
                res.status(200).send(post);
            }
        } catch (e) {
            res.status(500).send("postsRouter.get/:id" + e)
        }
    }
);
postsRouter.delete(
    "/:id",
    baseAuthMiddleware,
    async (req: RequestWithURL<{ id: string }>,
           res: Response<string>) => {
        try {
            let isPost = await postsService.findPost(req.params.id);
            if (!isPost) {
                res.sendStatus(404);
            } else {
                let isDel = await postsService.deletePost(req.params.id);
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("postsRouter.delete/:id" + e)
        }
    }
);
postsRouter.post(
    "/",
    baseAuthMiddleware,
    blogIdValidation,
    titleValidation,
    shortDesValidation,
    contentValidation,
    inputValMiddleware,
    async (req: RequestWithBody<postCreateType>,
           res: Response<postViewType | string>) => {
        try {
            const getBlog = await blogsQwRepository.findBlog(req.body.blogId);
            if (getBlog) {
                const newPost = await postsService.createPost(
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content,
                    req.body.blogId,
                    getBlog.name
                );
                res.status(201).send(newPost);
            }
        } catch (e) {
            res.status(500).send("postsRouter.post/" + e)
        }
    }
);
postsRouter.put(
    "/:id",
    baseAuthMiddleware,
    blogIdValidation,
    titleValidation,
    shortDesValidation,
    contentValidation,
    inputValMiddleware,
    async (
        req: RequestWithUrlAndBody<{ id: string }, postUpdateType>,
        res: Response<string>
    ) => {
        try {
            const isPost = await postsService.findPost(req.params.id);
            if (!isPost) {
                res.sendStatus(404);
            } else {
                const isUpD = await postsService.updatePost(
                    req.params.id,
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content,
                    req.body.blogId
                );
                return res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("postsRouter.put/:id" + e)
        }
    }
);
postsRouter.post(
    "/:postId/comments",
    bearerAuthMiddleware,
    contentOfCommentsMiddleware,
    inputValMiddleware,
    async (
        req: RequestWithUrlAndBody<{ postId: string }, { content: string }>,
        res: Response<commentViewType | string>
    ) => {
        try {
            const isPost = await postsQwRepository.findPost(req.params.postId);
            if (!isPost) {
                res.sendStatus(404);
                return;
            } else {
                const newComment = await commentsService.createComment(
                    req.body.content,
                    req.user!,
                    req.params.postId
                );
                res.status(201).send(newComment);
            }
        } catch (e) {
            res.status(500).send("postsRouter.post/:postId/comments" + e)
        }
    }
);
postsRouter.get(
    "/:postId/comments",
    async (
        req: RequestWithUrlAndQuery<{ postId: string }, any>,
        res: Response<commentsViewType | string>
    ) => {
        try {
            const isPost = await postsQwRepository.findPost(req.params.postId);
            if (!isPost) {
                res.sendStatus(404);
                return;
            } else {
                const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
                let sortField: string = sortBy ? sortBy : "createdAt";
                let pN = pageNumber ? +pageNumber : 1;
                let pS = pageSize ? +pageSize : 10;
                let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
                const comments = await commentsQweryRepository.findComments(
                    req.params.postId,
                    pN,
                    pS,
                    sortField,
                    sD
                );
                if (!comments) {
                    res.sendStatus(404);
                    return;
                } else {
                    res.status(200).send(comments);
                }
            }
        } catch (e) {
            res.status(500).send("postsRouter.get/:postId/comments" + e)
        }
    }
);
