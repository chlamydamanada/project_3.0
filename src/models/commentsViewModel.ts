import {commentViewType} from "./commentViewModel";

export type commentsViewType = {
pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: commentViewType[],
}