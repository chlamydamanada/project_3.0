import { ObjectId } from "mongodb";
import { blogViewType } from "../models/blogViewModel";
import { blogsViewType } from "../models/blogsViewModel";
import { sortingQueryFields } from "../helpers/sortingFields";
import {BlogsModel, postsModel} from "./db";

type searchVal = {
  name?: {};
};
export const blogsQwRepository = {
  async findBlogs(
    searchNameTerm: string | undefined,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ): Promise<blogsViewType> {
    const searchValue = sortingQueryFields.nameFilter(searchNameTerm);
    const totalCount = await BlogsModel.count(searchValue);
    const blogs = await BlogsModel
      .find(searchValue)
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .lean();
    const items = blogs.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: items,
    };
  },

  async findBlog(id: string): Promise<blogViewType | undefined> {
    let blog = await BlogsModel.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return undefined;
    } else {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      };
    }
  },
  async findPostsById(
    blogId: string,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ) {
    let totalCount = await postsModel.count({ blogId: blogId });
    let posts = await postsModel
      .find({ blogId: blogId })
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
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: items,
    };
  },
};
