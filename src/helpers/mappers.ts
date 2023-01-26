import {likeStatusModel} from "../repositories/db";
import {newPostMapperType} from "../models/newPostMapperModel";
import {userForLikeStatusType} from "../models/userForLikeStatusModel";

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
    async postsMapper(posts: any[], user?: userForLikeStatusType | undefined | null) {
        try {
            const result = await Promise.all(posts.map(async post => {
                const newPost = await this.postMapper(post, user)
                return newPost
            }))

            return result

        } catch (e) {
            console.log("postsMapper error:", e)
        }

    },
    async postMapper(post: any, user?: userForLikeStatusType | undefined | null) {
        const newPost: newPostMapperType = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: await likeStatusModel
                    .count({entityId: post._id, entity: 'post', likeStatus: "Like"}),
                dislikesCount: await likeStatusModel
                    .count({entityId: post._id, entity: 'post', likeStatus: "Dislike"}),
                myStatus: "None",
                newestLikes: [{}]
            }
        };

        const newLikes = await likeStatusModel.find({entityId: post._id, entity: 'post', likeStatus: "Like"})
            .sort({addedAt: -1}).limit(3).lean();
        newPost.extendedLikesInfo.newestLikes = newLikes.map(s => ({
            addedAt: s.addedAt,
            userId: s.userId,
            login: s.userLogin
        }))


        if (!user) return newPost;

        let userReaction = await likeStatusModel.findOne({entityId: post._id, entity: 'post', userId: user.userId})
        if (userReaction) {
            newPost.extendedLikesInfo.myStatus = userReaction.status;
        }

        return newPost;


    },
    userMapper() {
    },
    usersMapper() {
    },
    async commentMapper(comment: any, user?: userForLikeStatusType | undefined | null) {
        const newComment = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: comment.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: await likeStatusModel
                    .count({entityId: comment._id, entity: 'comment', status: "Like"}),
                dislikesCount: await likeStatusModel
                    .count({entityId: comment._id, entity: 'comment', status: "Dislike"}),
                myStatus: "None"
            }
        }
        if (!user) return newComment;
        let userReaction = await likeStatusModel.findOne({entityId: comment._id, entity: 'comment', userId: user.userId})
        if (userReaction) {
            newComment.likesInfo.myStatus = userReaction.status;
        }
        return newComment;
    },
    async commentsMapper(comments: any[], user?: userForLikeStatusType | undefined | null) {
        try {
            const result = await Promise.all(comments.map(async comment => {
                await this.commentMapper(comment, user)
            }))
            return result

        } catch (e) {
            console.log("commentsMapper error:", e)
        }


    },
}
