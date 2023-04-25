const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
