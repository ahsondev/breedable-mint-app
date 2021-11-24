const express = require('./services/express')
const routes = require('./routes')
const db = require('./models')

const port = process.env.PORT || 4000
const app = express(routes)

db.connectionSeq.sync()

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
