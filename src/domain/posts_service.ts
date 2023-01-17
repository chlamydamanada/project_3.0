import { postsRepository } from "../repositories/posts_db_repository";
import { postCreateServiceType } from "../models/postCreateModel";
import {PostDbClass} from "../classes/PostDbClass";

class PostsService{
  async deletePost(id: string) {
    return await postsRepository.deletePost(id);
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
    return await postsRepository.createPost(newPost);
  }
  async updatePost(
      id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string
  ) {
    return await postsRepository.updatePost(
        id,
        title,
        shortDescription,
        content,
        blogId
    );
  }
  async findPost(id: string): Promise<boolean> {
    return await postsRepository.findPost(id);
  }
}


export const postsService = new PostsService();
