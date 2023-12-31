/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose')
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    const rootUser = await User.find({ username: 'root' })
    rootUser[0].blogs = []
    await rootUser[0].save()
    // eslint-disable-next-line no-restricted-syntax
    for (const blog of helper.initialBlogs) {
        const blogObject = new Blog(blog)
        // eslint-disable-next-line no-await-in-loop
        const user = await User.findById(blog.user)
        await blogObject.save()
        user.blogs = user.blogs.concat(blogObject._id)
        await user.save()
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
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(
                'Authorization',
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0Yzk1N2RhODk0MzJkMDY3ZTcyNTQwYyIsImlhdCI6MTY5MDkyOTUwNn0.EMqOCvTdQPQmxGR-KV1RQJcLliugPi_lJwwDOrhCpCA'
            )

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

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set(
                'Authorization',
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0Yzk1N2RhODk0MzJkMDY3ZTcyNTQwYyIsImlhdCI6MTY5MDkyOTUwNn0.EMqOCvTdQPQmxGR-KV1RQJcLliugPi_lJwwDOrhCpCA'
            )
        expect(response.body.likes).toBe(0)
    })

    test('-4.12 Blog without title and url status 400 Bad request', async () => {
        const newBlogWithoutTitle = {
            author: 'Victor Dominguez',
            url: 'another URL',
        }

        const newBlogWithoutUrl = {
            title: 'Blog without URL',
            author: 'Victor Dominguez',
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitle)
            .expect(400)
            .set(
                'Authorization',
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0Yzk1N2RhODk0MzJkMDY3ZTcyNTQwYyIsImlhdCI6MTY5MDkyOTUwNn0.EMqOCvTdQPQmxGR-KV1RQJcLliugPi_lJwwDOrhCpCA'
            )

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .expect(400)
            .set(
                'Authorization',
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0Yzk1N2RhODk0MzJkMDY3ZTcyNTQwYyIsImlhdCI6MTY5MDkyOTUwNn0.EMqOCvTdQPQmxGR-KV1RQJcLliugPi_lJwwDOrhCpCA'
            )
    })

    test('-4.13 Deleting an existing blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set(
                'Authorization',
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0Yzk1N2RhODk0MzJkMDY3ZTcyNTQwYyIsImlhdCI6MTY5MDkyOTUwNn0.EMqOCvTdQPQmxGR-KV1RQJcLliugPi_lJwwDOrhCpCA'
            )
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const contents = blogsAtEnd.map((r) => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })

    test('-4.14 Updating an existing blog', async () => {
        const updatedInfo = {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 15,
        }

        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedInfo)

        const blogsAtEnd = await helper.blogsInDb()
        expect(updatedBlog.body.likes).toBe(15)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('-4.23 New blog without authorization', async () => {
        const newBlog = {
            title: 'Blog for testing part 4.23',
            author: 'Victor Dominguez',
            url: 'notValidURL',
            likes: 14,
        }

        await api.post('/api/blogs').send(newBlog).expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
