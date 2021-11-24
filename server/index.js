const express = require('./services/express')
const routes = require('./routes')
const db = require('./models')

const port = 4000
const host = '127.0.0.1'
const app = express(routes)

db.connectionSeq.sync()

app.listen(port, host, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
