/* eslint-disable comma-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest')
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('-5.15 creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map((u) => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test.only('-5.16 Creating a invaled user', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUsernameUser = {
            username: 'vc',
            name: 'Victor',
            password: 'secretpassword',
        }

        const invalidPassUser = {
            username: 'yespri93',
            name: 'Victor',
            password: 'as',
        }

        await api
            .post('/api/users')
            .send(invalidUsernameUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/users')
            .send(invalidPassUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})
