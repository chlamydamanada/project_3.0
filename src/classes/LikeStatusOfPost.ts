export class LikeStatusOfPostClass {
    addedAt: string
    constructor(
        public postId: string,
        public userId: string,
        public userLogin: string,
        public likeStatus: string
    ) {
        this.addedAt = new Date().toISOString()
    }
}