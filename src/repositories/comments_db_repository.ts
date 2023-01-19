import {commentViewType} from "../models/commentViewModel";
import {ObjectId} from "mongodb";
import {commentDbType} from "../models/commentDbModel";
import {commentsModel, likeStatusOfCommentsModel} from "./db";
import {likeStatusOfCommentDbType} from "../models/likeStatusOfCommentDbModel";

class CommentsRepositoryClass {
    async createComment(comment: commentDbType): Promise<commentViewType> {
        const result = await commentsModel.create(comment);
        return {
            id: result._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
        };
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const isDel = await commentsModel.deleteOne({
            _id: new ObjectId(commentId),
        });
        return isDel.deletedCount === 1;
    }

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const newComment = await commentsModel.updateOne(
            {_id: new ObjectId(commentId)},
            {
                $set: {
                    content: content,
                },
            }
        );
        return newComment.matchedCount === 1;
    }

    async findStatusOfComment(commentId: string, userId: string) {
        const status = await likeStatusOfCommentsModel.findOne({commentId: commentId, userId: userId});
        if (status) return status;
        if (!status) return undefined;
    }

    async createStatusOfComment(newStatus: likeStatusOfCommentDbType) {
        await likeStatusOfCommentsModel.create(newStatus);
    }

    async updateStatusOfComment(commentId: string, userId: string, status: string) {
        await likeStatusOfCommentsModel.updateOne({commentId: commentId, userId: userId},{likeStatus: status})
    }
};
export const commentsRepository = new CommentsRepositoryClass();