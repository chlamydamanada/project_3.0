import {postViewType} from "./postViewModel";

export type postsViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postViewType[]
}