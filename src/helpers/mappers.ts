
export const mappers = {
    blogMapper(blog: any){
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
        };
    },
    blogsMapper(blogs: any[]){
        const result = blogs.map((b) => ({
            id: b._id.toString(),
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt,
        }));
        return result;
    },
    postsMapper(posts: any[]){
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
    postMapper(){},
    userMapper(){},
    usersMapper(){},
    commentMapper(){},
    commentsMapper(){}
}