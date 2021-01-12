const fs = require('fs')
const path = require('path')

const file1 = path.resolve(__dirname, '.', 'data.txt')
const file2 = path.resolve(__dirname, '.', 'data-bak.txt')

const readStream = fs.createReadStream(file1)
const writeSteam = fs.createWriteStream(file2)

readStream.pipe(writeSteam)

readStream.on('end', () => console.log('copy done'))
readStream.on('error', err => console.error(err))
