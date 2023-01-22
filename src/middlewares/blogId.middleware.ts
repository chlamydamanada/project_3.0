import {body} from "express-validator";
import {blogsService} from "../composition_root";


export const blogIdValidation = body("blogId")
    .isString()
    .custom(async (blogId: string) => {
        const findBlogWithId = await blogsService.findBlog(blogId);
        if (!findBlogWithId) {
            throw new Error("Blog with this id does not exist in the DB");
        }
        return true;
    });
