const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.resolve(__dirname, '..', '..', 'logs', 'access.log')
const readStream = fs.createReadStream(fileName)

// 创建 readline
const rl = readline.createInterface({
  input: readStream
})

let sum = 0
let chromeNumber = 0

rl.on('line', lineData => {
  if (!lineData) return

  // 记录总行数
  sum++

  const arr = lineData.split(' -- ')

  if (arr[2] && arr[2].indexOf('Chrome') > -1) {
    chromeNumber++
  }
})

rl.on('close', () => {
  console.log('chrome 占比：' + chromeNumber / sum)
})
