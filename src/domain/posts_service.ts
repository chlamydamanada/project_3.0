import {PostsRepositoryClass} from "../repositories/posts_db_repository";
import { postCreateServiceType } from "../models/postCreateModel";
import {PostDbClass} from "../classes/PostDbClass";
import {postViewType} from "../models/postViewModel";

export class PostsService{
  postsRepository : PostsRepositoryClass
  constructor() {
    this.postsRepository = new PostsRepositoryClass()
  }

  async deletePost(id: string) {
    const result = await this.postsRepository.deletePost(id);
    return result;
  }
  async createPost(
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string
  ): Promise<postViewType> {
    const newPost: postCreateServiceType = new PostDbClass(
        title,
        shortDescription,
        content,
        blogId,
        blogName);
    const result = await this.postsRepository.createPost(newPost);
    return result;
  }
  async updatePost(
      id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string
  ) {
    const result = await this.postsRepository.updatePost(
        id,
        title,
        shortDescription,
        content,
        blogId
    );
    return result;
  }
  async findPost(id: string): Promise<boolean> {
    const result = await this.postsRepository.findPost(id);
    return result;
  }
}



