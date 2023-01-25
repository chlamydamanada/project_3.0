export class LikeStatusOfPostClass {
    addedAt: string
    constructor(
        public commentId: string,
        public userId: string,
        public userLogin: string,
        public likeStatus: string
    ) {
        this.addedAt = new Date().toISOString()
    }
}