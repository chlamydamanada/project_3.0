export class CommentsDbClass {
    createdAt: string
    constructor(
        public postId: string,
        public content: string,
        public userId: string,
        public userLogin: string,
    ) {
        this.createdAt = new Date().toISOString()
    }
}