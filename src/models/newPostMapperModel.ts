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
        newestLikes: newestLikesType[] | [{}]
    }
}

   export type newestLikesType = {
       addedAt: string,
       userId: string,
       login: string
   }