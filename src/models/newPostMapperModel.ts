import {likeStatusOfPostsModel} from "../repositories/db";

export type newPostMapperType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: newestLikesType[] | null
    }
}

   export type newestLikesType = {
       addedAt: string,
       userId: string,
       login: string
   }