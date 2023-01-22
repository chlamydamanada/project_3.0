import {likeStatusOfCommentsModel} from "../repositories/db";

export const mappers = {
    blogMapper(blog: any) {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
        };
    },
    blogsMapper(blogs: any[]) {
        const result = blogs.map((b) => ({
            id: b._id.toString(),
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt,
        }));
        return result;
    },
    postsMapper(posts: any[]) {
        const result = posts.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt,
        }))
        return result;
    },
    postMapper() {
    },
    userMapper() {
    },
    usersMapper() {
    },
    async commentMapper(comment: any, userId?: string | undefined | null) {
        const newComment = {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: await likeStatusOfCommentsModel
                    .count({commentId: comment._id, likeStatus: "Like"}),
                dislikesCount: await likeStatusOfCommentsModel
                    .count({commentId: comment._id, likeStatus: "Dislike"}),
                myStatus: "None"
            }
        }
        console.log("newComment in mapper:", newComment);
        if (!userId) return newComment;
        const userReaction = await likeStatusOfCommentsModel.findOne({commentId: comment.id, userId: userId})
        if (userReaction) {
            newComment.likesInfo.myStatus = userReaction.likeStatus;
        }
        return newComment;
    },
    async commentsMapper(comments: any[], userId?: string | undefined | null) {
        try {

            const result = await Promise.all(comments.map(async comment => {
                const item = await this.commentMapper(comment, userId)

                return item
            }))
            return result

        } catch (e) {
            console.log("commentsMapper error:", e)
        }


    },
}
