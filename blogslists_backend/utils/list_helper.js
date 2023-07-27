// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => blog.likes + sum, 0)

const favoriteBlog = (blogs) =>
    blogs
        .map((blog) => ({
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
        }))
        .reduce((acc, blog) => {
            if (blog.likes > acc.likes) {
                return blog
            }
            return acc
        })

const mostBlogs = (blogs) => {
    // eslint-disable-next-line no-return-assign, no-param-reassign
    const blogCountsByAuthor = {}

    blogs.forEach((blog) => {
        // eslint-disable-next-line operator-linebreak
        blogCountsByAuthor[blog.author] =
            (blogCountsByAuthor[blog.author] ?? 0) + 1
    })

    const entries = Object.entries(blogCountsByAuthor)

    const result = entries.reduce(
        (max, current) => {
            if (current[1] > max[1]) {
                return current
            }
            return max
        },
        // eslint-disable-next-line comma-dangle
        ['', 0]
    )
    return {
        author: result[0],
        blogs: result[1],
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}
