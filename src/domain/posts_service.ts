import {PostsRepositoryClass} from "../repositories/posts_db_repository";
import { postCreateServiceType } from "../models/postCreateModel";
import {PostDbClass} from "../classes/PostDbClass";

export class PostsService{
  postsRepository : PostsRepositoryClass
  constructor() {
    this.postsRepository = new PostsRepositoryClass()
  }

  async deletePost(id: string) {
    return await this.postsRepository.deletePost(id);
  }
  async createPost(
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string
  ) {
    const newPost: postCreateServiceType = new PostDbClass(
        title,
        shortDescription,
        content,
        blogId,
        blogName);
    return await this.postsRepository.createPost(newPost);
  }
  async updatePost(
      id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string
  ) {
    return await this.postsRepository.updatePost(
        id,
        title,
        shortDescription,
        content,
        blogId
    );
  }
  async findPost(id: string): Promise<boolean> {
    return await this.postsRepository.findPost(id);
  }
}



