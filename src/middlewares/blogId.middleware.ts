import {body} from "express-validator";
import {container} from "../composition_root";
import {BlogsService} from "../domain/blogs_service";

const blogsService = container.resolve(BlogsService)

export const blogIdValidation = body("blogId")
    .isString()
    .custom(async (blogId: string) => {
        const findBlogWithId = await blogsService.findBlog(blogId);
        if (!findBlogWithId) {
            throw new Error("Blog with this id does not exist in the DB");
        }
        return true;
    });
