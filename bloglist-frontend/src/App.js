import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorType('error')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
        setErrorType('')
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    console.log('Creating new blog')
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }
    console.log('🚀 ~ file: App.js:61 ~ addBlog ~ newBlog:', newBlog)
    try {
      const returnedBlog = await blogService.create(newBlog)
      console.log(
        '🚀 ~ file: App.js:64 ~ addBlog ~ returnedBlog:',
        returnedBlog
      )
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorType('info')
      setErrorMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setTimeout(() => {
        setErrorMessage(null)
        setErrorType('')
      }, 5000)
    } catch (exception) {
      console.log(
        '🚀 ~ file: App.js:72 ~ addBlog ~ exception:',
        exception.response.data.error
      )
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <h2>create new</h2>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Username"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Username"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{' '}
          <input
            type="text"
            value={url}
            name="Username"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">crear</button>
      </div>
    </form>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setTitle('')
    setUrl('')
    setAuthor('')
  }

  return (
    <div>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <Notification message={errorMessage} type={errorType} />
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification message={errorMessage} type={errorType} />
          <p>
            {user.name} logged-in <button onClick={logout}>logout</button>
          </p>
          {createBlogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
