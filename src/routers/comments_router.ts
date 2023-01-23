import {Router} from "express";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {userIsOwnerOfCommentMiddleware} from "../middlewares/userIsOwnerOfComment.middleware";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {commentStatusValidation} from "../middlewares/commentStatus.middleware";
import {container} from "../composition_root";
import {CommentsController} from "../controllers/comments_controller";

export const commentsRouter = Router();

const commentsController = container.resolve(CommentsController)

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
