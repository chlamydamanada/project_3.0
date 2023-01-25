import {PostsService} from "../domain/posts_service";
import {AuthServiceClass} from "../domain/auth_service";
import {BlogsQwRepositoryClass} from "../repositories/blogs_qwery_repo";
import {PostsQwRepositoryClass} from "../repositories/posts_qwery_repo";
import {CommentsQweryRepositoryClass} from "../repositories/comments_qwery_repository";
import {CommentsService} from "../domain/comments_service";
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithURL,
    RequestWithUrlAndBody,
    RequestWithUrlAndQuery
} from "../models/request_types";
import {postQueryType} from "../models/postQueryModel";
import {Response} from "express";
import {postsViewType} from "../models/postsViewModel";
import {postViewType} from "../models/postViewModel";
import {postCreateType} from "../models/postCreateModel";
import {postUpdateType} from "../models/postUpdateModel";
import {commentViewType} from "../models/commentViewModel";
import {commentsViewType} from "../models/commentsViewModel";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(@inject(PostsService) protected postsService: PostsService,
                @inject(AuthServiceClass) protected authService: AuthServiceClass,
                @inject(BlogsQwRepositoryClass) protected blogsQwRepository: BlogsQwRepositoryClass,
                @inject(PostsQwRepositoryClass) protected postsQwRepository: PostsQwRepositoryClass,
                @inject(CommentsQweryRepositoryClass) protected commentsQweryRepository: CommentsQweryRepositoryClass,
                @inject(CommentsService) protected commentsService: CommentsService
    ) {
    }

    async getAllPosts(req: RequestWithQuery<postQueryType>,
                      res: Response<postsViewType | string>) {
        try {
            const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
            let sortField: string = sortBy ? sortBy : "createdAt";
            let pN = pageNumber ? +pageNumber : 1;
            let pS = pageSize ? +pageSize : 10;
            let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
            let userID: null | string = null;
            if (req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                userID = await this.authService.decodeToken(token);
            }
            const posts = await this.postsQwRepository.findPosts(pN, pS, sortField, sD, userID);
            res.status(200).send(posts);
        } catch (e) {
            res.status(500).send("postsRouter.get/" + e)
        }
    }

    async getPostById(req: RequestWithURL<{ id: string }>,
                      res: Response<postViewType | string>) {
        try {
            let userID: null | string = null;
            if (req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                userID = await this.authService.decodeToken(token);
            }
            const post = await this.postsQwRepository.findPost(req.params.id);
            if (!post) {
                res.sendStatus(404);
            } else {
                res.status(200).send(post);
            }
        } catch (e) {
            res.status(500).send("postsRouter.get/:id" + e)
        }
    }

    async deletePostById(req: RequestWithURL<{ id: string }>,
                         res: Response<string>) {
        try {
            let isPost = await this.postsService.findPost(req.params.id);
            if (!isPost) {
                res.sendStatus(404);
            } else {
                let isDel = await this.postsService.deletePost(req.params.id);
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("postsRouter.delete/:id" + e)
        }
    }

    async createPost(req: RequestWithBody<postCreateType>,
                     res: Response<postViewType | string>) {
        try {
            const getBlog = await this.blogsQwRepository.findBlog(req.body.blogId);
            console.log('*****////getBlog//////*****:', getBlog)
            if (getBlog) {
                const newPostId = await this.postsService.createPost(
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content,
                    req.body.blogId,
                    getBlog.name
                );
                console.log('*****////newPostId//////*****:', newPostId)
                const newPost = await this.postsQwRepository.findPost(newPostId)
                if (newPost) res.status(201).send(newPost);
                console.log('*****////newPost//////*****:', newPost)
            }
        } catch (e) {
            res.status(500).send("postsRouter.post/" + e)
        }
    }

    async updatePost(req: RequestWithUrlAndBody<{ id: string }, postUpdateType>,
                     res: Response<string>) {
        try {
            const isPost = await this.postsService.findPost(req.params.id);
            if (!isPost) {
                res.sendStatus(404);
            } else {
                const isUpD = await this.postsService.updatePost(
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

    async createCommentByPostId(req: RequestWithUrlAndBody<{ postId: string }, { content: string }>,
                                res: Response<commentViewType | string>) {
        try {
            const isPost = await this.postsQwRepository.findPost(req.params.postId);
            if (!isPost) {
                res.sendStatus(404);
                return;
            }
            const newCommentId = await this.commentsService.createComment(
                req.body.content,
                req.user!,
                req.params.postId
            );
            const newComment = await this.commentsQweryRepository.findCommentById(newCommentId)
            res.status(201).send(newComment);

        } catch (e) {
            res.status(500).send("postsRouter.post/:postId/comments" + e)
        }
    }

    async getCommentsByPostId(req: RequestWithUrlAndQuery<{ postId: string }, postQueryType>,
                              res: Response<commentsViewType | string>) {
        try {
            let userID: null | string = null;
            if (req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                userID = await this.authService.decodeToken(token);
            }

            const isPost = await this.postsQwRepository.findPost(req.params.postId);
            if (!isPost) {
                res.sendStatus(404);
                return;
            } else {
                const {sortBy, pageNumber, pageSize, sortDirection} = req.query;
                let sortField: string = sortBy ? sortBy : "createdAt";
                let pN = pageNumber ? +pageNumber : 1;
                let pS = pageSize ? +pageSize : 10;
                let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
                const comments = await this.commentsQweryRepository.findComments(
                    req.params.postId,
                    pN,
                    pS,
                    sortField,
                    sD,
                    userID
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

    async updateLikeStatusByPostId(req: RequestWithUrlAndBody<{ postId: string }, { likeStatus: string }>,
                                   res: Response<string>) {
        try {
            const post = await this.postsQwRepository.findPost(req.params.postId);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            await this.postsService.generateStatusOfPost(
                req.params.postId,
                req.user!.id,
                req.user!.login,
                req.body.likeStatus)
            res.sendStatus(204);

        } catch (e) {
            res.status(500).send("commentsRouter.put/:commentId" + e)
        }

    }

};