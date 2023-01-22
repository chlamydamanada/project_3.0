import {Router} from "express";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {userIsOwnerOfCommentMiddleware} from "../middlewares/userIsOwnerOfComment.middleware";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {commentStatusValidation} from "../middlewares/commentStatus.middleware";
import {commentsController} from "../composition_root";

export const commentsRouter = Router();

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
