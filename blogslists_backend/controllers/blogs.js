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

    const user = await User.findById(body.user)

    const newBlog = Blog({ ...body, user: user.id })
    const savedBlog = await await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

// Peticion DELETE para eliminar un blog existente en la BD
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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
