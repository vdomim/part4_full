const Notification = ({ message, type }) => {
  console.log('🚀 ~ file: Notification.js:2 ~ Notification ~ type:', type)
  console.log('🚀 ~ file: Notification.js:2 ~ Notification ~ message:', message)
  if (message === null) {
    return null
  }

  return <div className={type}>{message}</div>
}

export default Notification
