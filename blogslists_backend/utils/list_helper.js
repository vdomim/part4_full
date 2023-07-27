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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
