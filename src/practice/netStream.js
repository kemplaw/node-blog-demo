const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    fs.createReadStream(path.resolve(__dirname, '.', 'data.txt')).pipe(res)
  }
})

server.listen(8000)
