const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const fs = require('fs-extra')
const resolvePath = require('path').resolve

module.exports = function expressApp(routes) {
  const app = express()

  if (process.env.NODE_ENV === 'development') {
    app.use(cors())
  }
  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(express.static(resolvePath(__dirname, '../../build')))
  app.use('/api', routes)
  app.get('/*', (req, res) => {
    const contents = fs.readFileSync(
      resolvePath(__dirname, '../../build/index.html'),
      'utf8',
    )
    res.send(contents)
  })

  return app
}
