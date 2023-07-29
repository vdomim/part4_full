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

describe('------Part 4_8 Tests------', () => {
    test('Correct number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log(response.body)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
