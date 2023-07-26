// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config()

// eslint-disable-next-line prefer-destructuring
const PORT = process.env.PORT
// eslint-disable-next-line prefer-destructuring
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT,
}
