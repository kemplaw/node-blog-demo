const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'myblog'

MongoClient.connect(
  url,
  {
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error('mongodb connect err: ', err)

      return
    }

    console.log('connected')

    // 切换到数据库

    const db = client.db(dbName)

    // 关闭连接(正式项目可以不关闭)
    client.close()
  }
)
