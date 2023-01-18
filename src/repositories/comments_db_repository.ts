import { commentViewType } from "../models/commentViewModel";
import { ObjectId } from "mongodb";
import { commentDbType } from "../models/commentDbModel";
import {commentsModel} from "./db";

class CommentsRepositoryClass  {
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
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: content,
        },
      }
    );
    return newComment.matchedCount === 1;
  }
};
export const commentsRepository = new CommentsRepositoryClass();