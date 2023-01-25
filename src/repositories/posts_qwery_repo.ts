import {ObjectId} from "mongodb";
import {postsModel} from "./db";
import {postsViewType} from "../models/postsViewModel";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";
import {injectable} from "inversify";
import {mappers} from "../helpers/mappers";

@injectable()
export class PostsQwRepositoryClass {
    async findPosts(
        pN: number,
        pS: number,
        sortField: string,
        sD: 1 | -1,
        userId?: string | undefined | null
    ): Promise<postsViewType> {
        let totalCount = await postsModel.count({});
        const posts = await postsModel
            .find({})
            .sort({[sortField]: sD})
            .skip((pN - 1) * pS)
            .limit(pS)
            .lean();
        const items = await mappers.postsMapper(posts, userId);
        return getArrayWithPagination(totalCount,
            pS,
            pN,
            items);
    }

    async findPost(
        id: string,
        userId?: string | undefined | null
    ) {
        let post = await postsModel.findOne({_id: new ObjectId(id)});
        if (!post) {
            return undefined;
        }
        const result = await mappers.postMapper(post, userId);
        return result;
    }
};
