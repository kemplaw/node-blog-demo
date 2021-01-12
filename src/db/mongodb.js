const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'
const dbName = 'myblog'

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err => {
  console.error('mongo connection error: ', err)
})

db.on('open', () => console.log('mongo connected successfully'))

module.exports = mongoose
