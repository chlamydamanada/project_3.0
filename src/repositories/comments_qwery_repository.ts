import {ObjectId} from "mongodb";
import {commentsModel} from "./db";
import {commentViewType} from "../models/commentViewModel";
import {commentsViewType} from "../models/commentsViewModel";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";

class CommentsQweryRepositoryClass {
  async findComments(
    postId: string,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ): Promise<commentsViewType> {
    const totalCount = await commentsModel.count({ postId: postId });
    const comments = await commentsModel
      .find({ postId: postId })
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .lean();
    const items = comments.map((c) => ({
      id: c._id.toString(),
      content: c.content,
      userId: c.userId,
      userLogin: c.userLogin,
      createdAt: c.createdAt,
    }));
    return getArrayWithPagination(totalCount,
        pS,
        pN,
        items);
  }
  async findCommentById(id: string): Promise<commentViewType | undefined> {
     let comment = await commentsModel.findOne({ _id: new ObjectId(id) });
    if (comment) {
      return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
      };
    } else {
      return undefined;
    }
  }

};
export const commentsQweryRepository = new CommentsQweryRepositoryClass();