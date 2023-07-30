const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    // eslint-disable-next-line no-restricted-syntax
    for (const blog of helper.initialBlogs) {
        const blogObject = new Blog(blog)
        // eslint-disable-next-line no-await-in-loop
        await blogObject.save()
    }
})

describe('------Part 4 Tests------', () => {
    test('-4.8 GET correct number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('-4.9 Id propperty checking', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('-4.10 POST number of blogs', async () => {
        const newBlog = {
            title: 'Blog for testing part 4.10',
            author: 'Victor Dominguez',
            url: 'notValidURL',
            likes: 14,
        }

        await api.post('/api/blogs').send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map((n) => n.title)
        expect(contents).toContain('Blog for testing part 4.10')
    })

    test('-4.11 Saving blog without likes', async () => {
        const newBlog = {
            title: 'Blog without likes',
            author: 'Victor Dominguez',
            url: 'another URL',
        }

        const response = await api.post('/api/blogs').send(newBlog)
        console.log(response)
        expect(response.body.likes).toBe(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
