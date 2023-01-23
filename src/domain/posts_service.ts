import {PostsRepositoryClass} from "../repositories/posts_db_repository";
import {postCreateServiceType} from "../models/postCreateModel";
import {PostDbClass} from "../classes/PostDbClass";
import {inject, injectable} from "inversify";
@injectable()
export class PostsService {

    constructor(@inject(PostsRepositoryClass) protected postsRepository: PostsRepositoryClass) {
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
    ): Promise<string> {
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



