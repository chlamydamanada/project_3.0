import {ObjectId} from "mongodb";
import {postsModel} from "./db";
import {postsViewType} from "../models/postsViewModel";
import {getArrayWithPagination} from "../helpers/arrayWhithPagination";

export const postsQwRepository = {
  async findPosts(pN: number, pS: number, sortField: string, sD: 1 | -1): Promise<postsViewType> {
    let totalCount = await postsModel.count({});
    const posts = await postsModel
      .find({})
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .lean();
    const items = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
    }));
    return getArrayWithPagination(totalCount,
        pS,
        pN,
        items);
  },
  async findPost(id: string) {
    let post = await postsModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
