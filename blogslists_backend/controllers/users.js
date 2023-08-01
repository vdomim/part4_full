/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable comma-dangle */
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { body } = request

    const saltRounds = 10
    if (body.password.length < 3) {
        return response.status(400).json({
            error: 'invalid password. Length must be 3 characters or more',
        })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    return response.json(savedUser)
})

module.exports = usersRouter
