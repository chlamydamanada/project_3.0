import {body} from "express-validator";

import {BlogsService} from "../domain/blogs_service";

const blogsService = new BlogsService()
export const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId: string) => {
    const findBlogWithId = await blogsService.findBlog(blogId);
    if (!findBlogWithId) {
      throw new Error("Blog with this id does not exist in the DB");
    }
    return true;
  });
