import {ObjectId} from "mongodb";
import {commentDbType} from "../models/commentDbModel";
import {commentsModel, likeStatusModel} from "./db";
import {likeStatusDbType} from "../models/likeStatusOfCommentDbModel";
import {injectable} from "inversify";

@injectable()
export class CommentsDbRepositoryClass {
    async createComment(comment: commentDbType): Promise<string> {
        const result = await commentsModel.create(comment);
        return result._id.toString();
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
        const status = await likeStatusModel.findOne({entityId: commentId, userId: userId});
        if (status) return status;
        if (!status) return undefined;
    }

    async createStatusOfComment(newStatus: likeStatusDbType) {
        await likeStatusModel.create(newStatus);
    }

    async updateStatusOfComment(commentId: string, userId: string, status: string) {
        await likeStatusModel.updateOne({entityId: commentId, userId: userId}, {status: status})
    }
};
