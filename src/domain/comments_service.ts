import {CommentsDbRepositoryClass} from "../repositories/comments_db_repository";
import {userViewType} from "../models/userViewModel";
import {commentDbType} from "../models/commentDbModel";
import {CommentsDbClass} from "../classes/CommentsDbClass";
import {LikeStatusOfCommentClass} from "../classes/LikeOfCommentsClass";

export class CommentsService {

    constructor(protected commentsDbRepository: CommentsDbRepositoryClass) {
    }

    async createComment(
        content: string,
        user: userViewType,
        postId: string
    ): Promise<string> {
        const newComment: commentDbType = new CommentsDbClass(
            postId,
            content,
            user.id,
            user.login
        );
        return await this.commentsDbRepository.createComment(newComment);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        return await this.commentsDbRepository.deleteComment(commentId);
    }

    async updateComment(commentId: string, content: string): Promise<boolean> {
        return await this.commentsDbRepository.updateComment(commentId, content);
    }

    async generateStatusOfComment(commentId: string, userId: string, status: string) {
        const statusOfComment = await this.commentsDbRepository.findStatusOfComment(commentId, userId);
        if (!statusOfComment) {
            const newStatus = new LikeStatusOfCommentClass(commentId, userId, status);
            await this.commentsDbRepository.createStatusOfComment(newStatus);
        }
        await this.commentsDbRepository.updateStatusOfComment(commentId, userId, status)
    }
}


