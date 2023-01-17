import {commentsRepository} from "../repositories/comments_db_repository";
import {userViewType} from "../models/userViewModel";
import {commentDbType} from "../models/commentDbModel";
import {commentViewType} from "../models/commentViewModel";
import {CommentsDbClass} from "../classes/CommentsDbClass";

class CommentsService {
    async createComment(
        content: string,
        user: userViewType,
        postId: string
    ): Promise<commentViewType> {
        const newComment: commentDbType = new CommentsDbClass(
            postId,
            content,
            user.id,
            user.login
        );
        return await commentsRepository.createComment(newComment);
    }
    async deleteComment(commentId: string): Promise<boolean> {
        return await commentsRepository.deleteComment(commentId);
    }
    async updateComment(commentId: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(commentId, content);
    }
}

export const commentsService = new CommentsService();
