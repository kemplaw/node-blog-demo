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

    // 使用就和
    const userCollection = db.collection('users')

    // // 新增
    // userCollection.insertOne({ username: '3' }, (err, res) => {
    //   if (err) {
    //     console.error('insert err: ', err)
    //     return
    //   }

    //   console.log(res)
    // })

    // 修改
    // userCollection.updateOne({ username: '3' }, { $set: { realname: '张三' } }, (err, res) => {
    //   if (err) {
    //     console.error('update err: ', err)

    //     return
    //   }

    //   console.log(res)

    //   client.close()
    // })

    // // 查询 条件可用正则
    // userCollection.find({ username: '1' }).toArray((err, res) => {
    //   if (err) {
    //     console.error('users find error: ', err)

    //     return
    //   }

    //   console.log(res)

    //   // 关闭连接(正式项目可以不关闭)
    //   client.close()
    // })

    // 删除
    userCollection.deleteOne({ realname: '张三' }, (err, res) => {
      if (err) {
        console.error('del err: ', err)
        return
      }

      console.log(res)

      client.close()
    })
  }
)
