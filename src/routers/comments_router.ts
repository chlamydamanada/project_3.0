import {Request, Response, Router} from "express";
import {commentsQweryRepository} from "../repositories/comments_qwery_repository";
import {commentsService} from "../domain/comments_service";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {userIsOwnerOfCommentMiddleware} from "../middlewares/userIsOwnerOfComment.middleware";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {commentViewType} from "../models/commentViewModel";
import {RequestWithURL} from "../models/request_types";

export const commentsRouter = Router();

commentsRouter.get("/:commentId",
    async (req: RequestWithURL<{ commentId: string }>,
                   res: Response<commentViewType | string>) => {
    try {
        const comment = await commentsQweryRepository.findCommentById(
            req.params.commentId
        );
        if (!comment) {
            res.sendStatus(404);
        } else {
            res.status(200).send(comment);
        }
    } catch (e) {
        res.status(500).send("commentsRouter.get/:commentId" + e)
    }
});
commentsRouter.delete(
    "/:commentId",
    bearerAuthMiddleware,
    userIsOwnerOfCommentMiddleware,
    async (req: RequestWithURL<{ commentId: string }>,
           res: Response<string>) => {
        try {
            await commentsService.deleteComment(req.params.commentId);
            res.sendStatus(204);
        } catch (e) {
            res.status(500).send("commentsRouter.delete/:commentId" + e)
        }
    }
);
commentsRouter.put(
    "/:commentId",
    bearerAuthMiddleware,
    userIsOwnerOfCommentMiddleware,
    contentOfCommentsMiddleware,
    inputValMiddleware,
    async (req: RequestWithURL<{ commentId: string }>,
           res: Response<string>) => {
        try {
            const newComment = await commentsService.updateComment(
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
);
