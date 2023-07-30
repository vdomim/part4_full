const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0,
    },
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        returnedObject.id = returnedObject._id.toString()
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete returnedObject._id
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Blog', blogSchema)
