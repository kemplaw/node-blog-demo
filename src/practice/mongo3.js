const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'
const dbName = 'myblog'

mongoose.set('useFindAndModify', false) // 避免相关 warning

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err => console.error(err))

db.on('open', () => console.log('连接成功'))

/**
 * @description: 定义 Schema
 */

// 用 Schema 定义数据规范
// user Schema
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: String,
    realname: String
  },
  {
    timestamps: true // 自动增加时间戳
  }
)

// Model 对应 collection
// 此处使用 user，mongoose 会自动创建 复数（users）的 collection
const User = mongoose.model('user', UserSchema)

// blog 规范
const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: String,
    author: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // 自动增加时间戳
  }
)

const Blog = mongoose.model('blog', BlogSchema)

// 数据操作

;(async () => {
  // 创建用户
  // const zhangsan = await User.create({
  //   username: 'zhangsan',
  //   password: '123',
  //   realname: '张三'
  // })

  // console.log(zhangsan)

  // 查询用户
  // const list = await User.find()
  // console.log(list)

  // 模拟登录
  // const hasLogin = await User.find({ username: 'zhangsan', password: '123' })
  // console.log(hasLogin)

  // 新建博客
  const newBlog = await Blog.create({
    title: 'new blog',
    content: 'blog',
    author: 'zhangsan'
  })

  // 根据id查询
  // const blogById = await Blog.findById('any id')

  // 修改
  const res = await Blog.findOneAndUpdate(
    { title: 'new blog' }, // 条件
    { title: 'old blog' },
    {
      new: true // 设置为 true 表示返回最新的数据
    }
  )

  // 删除
  const delRes = await Blog.findOneAndDelete({
    _id: 'any id',
    author: 'any author' // 最好增加 author 判断是否误删
  })
})()
