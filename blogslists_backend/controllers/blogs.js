/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable comma-dangle */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Peticion GET para recuperar todos los blogs de la BD
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// Peticion POST para insertar un nuevo blog en la BD
blogsRouter.post('/', async (request, response) => {
    const { body } = request
    console.log('Token: ', request.token)
    if (!request.token || !request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(request.user)

    const newBlog = Blog({ ...body, user: user.id })
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

// Peticion DELETE para eliminar un blog existente en la BD
blogsRouter.delete('/:id', async (request, response) => {
    if (!request.token || !request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(request.user)
    if (user.blogs.includes(request.params.id)) {
        await Blog.findByIdAndRemove(request.params.id)

        user.blogs = user.blogs.filter(
            (blog) => blog.toString() !== request.params.id
        )

        await user.save()
        response.status(204).end()
    } else {
        return response
            .status(401)
            .json({ error: 'This user is not the owner of the blog' })
    }
})

// Peticion PUT para actualizar los likes de un blog existente
blogsRouter.put('/:id', async (request, response) => {
    const { body } = request

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
    })

    response.json(updatedBlog)
})

module.exports = blogsRouter
