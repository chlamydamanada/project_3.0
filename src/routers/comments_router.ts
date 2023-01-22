import {Response, Router} from "express";
import {CommentsQweryRepositoryClass} from "../repositories/comments_qwery_repository";
import {CommentsService} from "../domain/comments_service";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {userIsOwnerOfCommentMiddleware} from "../middlewares/userIsOwnerOfComment.middleware";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {commentViewType} from "../models/commentViewModel";
import {RequestWithURL, RequestWithUrlAndBody} from "../models/request_types";
import {commentStatusValidation} from "../middlewares/commentStatus.middleware";
import {AuthServiceClass} from "../domain/auth_service";

export const commentsRouter = Router();

class CommentsController {
    private commentsService: CommentsService;
    private commentsQweryRepository: CommentsQweryRepositoryClass;
    private authService: AuthServiceClass;
    constructor() {
        this.commentsService = new CommentsService()
        this.commentsQweryRepository = new CommentsQweryRepositoryClass()
        this.authService = new AuthServiceClass()
    }

    async getCommentById(req: RequestWithURL<{ commentId: string }>,
                         res: Response<commentViewType | string>) {
        try {
            const userID : string | null = await this.authService.getUserIdByAccessToken(
                req.headers.authorization!.split(" ")[1]) ;

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
}

const commentsController = new CommentsController();

commentsRouter.get("/:commentId",
    commentsController.getCommentById.bind(commentsController));
commentsRouter.delete(
    "/:commentId",
    bearerAuthMiddleware,
    userIsOwnerOfCommentMiddleware,
    commentsController.deleteCommentById.bind(commentsController));
commentsRouter.put(
    "/:commentId",
    bearerAuthMiddleware,
    userIsOwnerOfCommentMiddleware,
    contentOfCommentsMiddleware,
    inputValMiddleware,
    commentsController.updateCommentById.bind(commentsController));
commentsRouter.put(
    "/:commentId/like-status",
    bearerAuthMiddleware,
    commentStatusValidation,
    inputValMiddleware,
    commentsController.updateLikeStatusByCommentId.bind(commentsController));
