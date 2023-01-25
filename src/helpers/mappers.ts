import {likeStatusOfCommentsModel, likeStatusOfPostsModel} from "../repositories/db";
import {newPostMapperType} from "../models/newPostMapperModel";

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
    async postsMapper(posts: any[], userId?: string | undefined | null) {
        try {
            const result = posts.map(async post => {
                await this.postMapper(post, userId)
            })
            return result

        } catch (e) {
            console.log("postsMapper error:", e)
        }

    },
    async postMapper(post: any, userId?: string | undefined | null) {
        const newPost: newPostMapperType = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: await likeStatusOfPostsModel
                    .count({postId: post._id, likeStatus: "Like"}),
                dislikesCount: await likeStatusOfPostsModel
                    .count({postId: post._id, likeStatus: "Dislike"}),
                myStatus: "None",
                newestLikes: null
            }
        };
        const newLikes = await likeStatusOfPostsModel.find({postId: post._id, likeStatus: "Like"})
            .sort({addedAt: -1}).limit(3).lean();
        newPost.extendedLikesInfo.newestLikes = newLikes.map(s => ({
            addedAt: s.addedAt,
            userId: s.userId,
            login: s.userLogin
        }))
        if (!userId) return newPost;
        let userReaction = await likeStatusOfPostsModel.findOne({postId: post._id, userId: userId})
        if (userReaction) {
            newPost.extendedLikesInfo.myStatus = userReaction.likeStatus;
        }
        return newPost;


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
        if (!userId) return newComment;
        let userReaction = await likeStatusOfCommentsModel.findOne({commentId: comment._id, userId: userId})
        if (userReaction) {
            newComment.likesInfo.myStatus = userReaction.likeStatus;
        }
        return newComment;
    },
    async commentsMapper(comments: any[], userId?: string | undefined | null) {
        try {
            const result = comments.map(async comment => {
                await this.commentMapper(comment, userId)
            })
            return result

        } catch (e) {
            console.log("commentsMapper error:", e)
        }


    },
}
