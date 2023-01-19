export class LikeStatusOfCommentClass {
    createdAt: string
    constructor(
        public commentId: string,
        public userId: string,
        public likeStatus: string
    ) {
        this.createdAt = new Date().toISOString()
    }
}