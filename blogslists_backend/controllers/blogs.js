const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Peticion GET para recuperar todos los blogs de la BD
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// Peticion POST para insertar un nuevo blog en la BD
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

module.exports = blogsRouter
