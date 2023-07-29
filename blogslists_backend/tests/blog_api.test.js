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
    test('-4.8 Correct number of blogs', async () => {
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
})

afterAll(() => {
    mongoose.connection.close()
})
