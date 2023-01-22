import {Router} from "express";
import {baseAuthMiddleware} from "../middlewares/baseAuthorization.middleware";
import {shortDesValidation} from "../middlewares/shortDescription.middleware";
import {contentValidation} from "../middlewares/content.middleware";
import {titleValidation} from "../middlewares/title.middleware";
import {nameValidation} from "../middlewares/name.middleware";
import {descriptionValidation} from "../middlewares/description.middleware";
import {websiteValidation} from "../middlewares/website.middleware";
import {inputValMiddleware} from "../middlewares/inputValue.middleware";
import {blogsController} from "../composition_root";

export const blogsRouter = Router();

blogsRouter.get("/",
    blogsController.getAllUsers.bind(blogsController));
blogsRouter.get("/:id",
    blogsController.getBlogById.bind(blogsController));
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
