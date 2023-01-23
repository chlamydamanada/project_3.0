import {BlogsRepositoryClass} from "../repositories/blogs_db_repository";
import {blogCreateServiceType} from "../models/blogCreateModel";
import {blogViewType} from "../models/blogViewModel";
import {BlogDbClass} from "../classes/BlogDbClass";
import {inject, injectable} from "inversify";
@injectable()
export class BlogsService {

  constructor(@inject(BlogsRepositoryClass) protected blogsRepository : BlogsRepositoryClass) {
  }

  async findBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.findBlog(id);
  }
  async deleteBlog(id: string) {
    return await this.blogsRepository.deleteBlog(id);
  }
  async createBlog(
      name: string,
      description: string,
      websiteUrl: string
  ): Promise<blogViewType> {
    const newBlog: blogCreateServiceType = new BlogDbClass(name, description, websiteUrl);
    return await this.blogsRepository.createBlog(newBlog);
  }
  async updateBlog(
      id: string,
      name: string,
      description: string,
      websiteUrl: string
  ) {
    return await this.blogsRepository.updateBlog(id, name, description, websiteUrl);
  }
}

