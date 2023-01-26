import {ObjectId} from "mongodb";
import {commentsModel} from "./db";
import {commentViewType} from "../models/commentViewModel";
import {commentsViewType} from "../models/commentsViewModel";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";
import {mappers} from "../helpers/mappers";
import {injectable} from "inversify";
import {userForLikeStatusType} from "../models/userForLikeStatusModel";
@injectable()
export class CommentsQweryRepositoryClass {
    async findComments(
        postId: string,
        pN: number,
        pS: number,
        sortField: string,
        sD: 1 | -1,
        user?: userForLikeStatusType | undefined | null
    ): Promise<commentsViewType> {
        const totalCount = await commentsModel.count({postId: postId});
        const comments = await commentsModel
            .find({postId: postId})
            .sort({[sortField]: sD})
            .skip((pN - 1) * pS)
            .limit(pS)
            .lean();
        const items = await Promise.all(comments.map(async comment => {
            const item = await mappers.commentMapper(comment, user)
            return item
        }))
        const result = getArrayWithPagination(totalCount,
            pS,
            pN,
            items);
        return result;
    }

    async findCommentById(id: string, user?: userForLikeStatusType | undefined | null): Promise<commentViewType | undefined> {
        let comment = await commentsModel.findOne({_id: new ObjectId(id)});
        if (comment) {
            const result = await mappers.commentMapper(comment, user);
            return result;
        } else {
            return undefined;
        }
    }

};
