import {blogsRepository} from "../repositories/blogs_db_repository";
import {blogCreateServiceType} from "../models/blogCreateModel";
import {blogViewType} from "../models/blogViewModel";
import {BlogDbClass} from "../classes/BlogDbClass";

class BlogsService {
  async findBlog(id: string): Promise<boolean> {
    return await blogsRepository.findBlog(id);
  }
  async deleteBlog(id: string) {
    return await blogsRepository.deleteBlog(id);
  }
  async createBlog(
      name: string,
      description: string,
      websiteUrl: string
  ): Promise<blogViewType> {
    const newBlog: blogCreateServiceType = new BlogDbClass(name, description, websiteUrl);
    return await blogsRepository.createBlog(newBlog);
  }
  async updateBlog(
      id: string,
      name: string,
      description: string,
      websiteUrl: string
  ) {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl);
  }
}
export const blogsService = new BlogsService();
