export const getArrayWithPagination = (
    totalCount: number,
    pS: number,
    pN: number,
    items: any
) => {
    return {
        pagesCount: Math.ceil(totalCount / pS),
        page: pN,
        pageSize: pS,
        totalCount: totalCount,
        items: items,
    }
}