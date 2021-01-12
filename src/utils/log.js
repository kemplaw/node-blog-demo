const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
  writeStream.write(log + '\n')
}

function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, '..', '..', 'logs', fileName)
  const writeSteam = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })

  return writeSteam
}
const accessWriteStream = createWriteStream('access.log')

function access(log) {
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}
