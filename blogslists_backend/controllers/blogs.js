const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Peticion GET para recuperar todos los blogs de la BD
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// Peticion POST para insertar un nuevo blog en la BD
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})

// Peticion DELETE para eliminar un blog existente en la BD
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})
module.exports = blogsRouter
