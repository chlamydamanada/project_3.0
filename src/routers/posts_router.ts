import {Router} from "express";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {blogIdValidation} from "../middlewares/blogId.middleware";
import {titleValidation} from "../middlewares/title.middleware";
import {shortDesValidation} from "../middlewares/shortDescription.middleware";
import {contentValidation} from "../middlewares/content.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthrization.middleware";
import {contentOfCommentsMiddleware} from "../middlewares/contentOfComments.middleware";
import {postsController} from "../composition_root";

export const postsRouter = Router();

postsRouter.get("/",
    postsController.getAllPosts.bind(postsController));
postsRouter.get(
    "/:id",
    postsController.getPostById.bind(postsController));
postsRouter.delete(
    "/:id",
    baseAuthMiddleware,
    postsController.deletePostById.bind(postsController));
postsRouter.post(
    "/",
    baseAuthMiddleware,
    blogIdValidation,
    titleValidation,
    shortDesValidation,
    contentValidation,
    inputValMiddleware,
    postsController.createPost.bind(postsController));
postsRouter.put(
    "/:id",
    baseAuthMiddleware,
    blogIdValidation,
    titleValidation,
    shortDesValidation,
    contentValidation,
    inputValMiddleware,
    postsController.updatePost.bind(postsController));
postsRouter.post(
    "/:postId/comments",
    bearerAuthMiddleware,
    contentOfCommentsMiddleware,
    inputValMiddleware,
    postsController.createCommentByPostId.bind(postsController));
postsRouter.get(
    "/:postId/comments",
    postsController.getCommentsByPostId.bind(postsController));
