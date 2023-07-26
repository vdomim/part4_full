// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => blog.likes + sum, 0)

module.exports = {
    dummy,
    totalLikes,
}
