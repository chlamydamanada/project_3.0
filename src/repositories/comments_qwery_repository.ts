import {ObjectId} from "mongodb";
import {commentsModel} from "./db";
import {commentViewType} from "../models/commentViewModel";
import {commentsViewType} from "../models/commentsViewModel";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";
import {mappers} from "../helpers/mappers";

export class CommentsQweryRepositoryClass {
    async findComments(
        postId: string,
        pN: number,
        pS: number,
        sortField: string,
        sD: 1 | -1,
        userId?: string | undefined | null
    ): Promise<commentsViewType> {
        const totalCount = await commentsModel.count({postId: postId});
        const comments = await commentsModel
            .find({postId: postId})
            .sort({[sortField]: sD})
            .skip((pN - 1) * pS)
            .limit(pS)
            .lean();
        console.log("COMMENTS:", comments)
        const items = await mappers.commentsMapper(comments, userId);






            console.log("ITEMS:", items)


        return getArrayWithPagination(totalCount,
            pS,
            pN,
            items);
    }

    async findCommentById(id: string, userId?: string | undefined | null): Promise<commentViewType | undefined> {
        let comment = await commentsModel.findOne({_id: new ObjectId(id)});
        if (comment) {
            return mappers.commentMapper(comment, userId)
        } else {
            return undefined;
        }
    }

};
