import {AuthServiceClass} from "../domain/auth_service";
import {CommentsService} from "../domain/comments_service";
import {CommentsQweryRepositoryClass} from "../repositories/comments_qwery_repository";
import {RequestWithURL, RequestWithUrlAndBody} from "../models/request_types";
import {Response} from "express";
import {commentViewType} from "../models/commentViewModel";

export class CommentsController {
    constructor(protected authService: AuthServiceClass,
                protected commentsService: CommentsService,
                protected commentsQweryRepository: CommentsQweryRepositoryClass) {
    }

    async getCommentById(req: RequestWithURL<{ commentId: string }>,
                         res: Response<commentViewType | string>) {
        try {
            let userID: null | string = null;
            if (req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                userID = await this.authService.decodeToken(token);
            }

            console.log('******', req.headers.authorization)
            console.log('+++++', userID)

            const comment = await this.commentsQweryRepository.findCommentById(
                req.params.commentId,
                userID
            );
            if (!comment) {
                res.sendStatus(404);
            } else {
                res.status(200).send(comment);
            }
        } catch (e) {
            res.status(500).send("commentsRouter.get/:commentId" + e)
        }
    }

    async deleteCommentById(req: RequestWithURL<{ commentId: string }>,
                            res: Response<string>) {
        try {
            await this.commentsService.deleteComment(req.params.commentId);
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("commentsRouter.delete/:commentId" + e)
        }
    }

    async updateCommentById(req: RequestWithURL<{ commentId: string }>,
                            res: Response<string>) {
        try {
            const newComment = await this.commentsService.updateComment(
                req.params.commentId,
                req.body.content
            );
            if (newComment) {
                res.sendStatus(204);
            }
        } catch (e) {
            res.status(500).send("commentsRouter.put/:commentId" + e)
        }
    }

    async updateLikeStatusByCommentId(req: RequestWithUrlAndBody<{ commentId: string }, { likeStatus: string }>,
                                      res: Response<string>) {
        try {
            const comment = await this.commentsQweryRepository.findCommentById(req.params.commentId);
            if (!comment) {
                res.sendStatus(404);
                return;
            }
            await this.commentsService.generateStatusOfComment(
                req.params.commentId,
                req.user!.id,
                req.body.likeStatus)
            res.sendStatus(204);

        } catch (e) {
            res.status(500).send("commentsRouter.put/:commentId" + e)
        }
    }
};