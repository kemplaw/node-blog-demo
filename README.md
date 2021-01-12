# node-todo

### 项目思路

目标

  - 开发 xx 系统，具有 xx 系统的基本功能；
  - 只开发 server 端，不关系前端；

需求
  
  - 需要实现的模块
    - 展示给用户看的模块；
    - 内部管理员需要使用的模块；
    - 例如，实现一个博客的功能模块：
      - 首页、作者主页、博客详情页；
      - 登录页；
      - 管理中心、新建页、编辑页。

总结
  
  - 需求一定明确，需求指导开发；
  - 不要纠结于简单的页面样式，并不影响 server 的开发；


### 技术方案

数据如何存储

如何与前端对接（接口如何设计）

登录解决方案


### 开发接口（不使用任何框架）

nodejs 处理 http 请求

搭建开发环境

开发接口（暂不连接数据库，暂不考虑登录）

### http 请求概述（面试常问）- 从浏览器地址栏输入地址到目标页面显示期间发生了什么

dns 解析，建立 tcp 连接（三次握手），发送 http 请求；

server 接收到 http 请求，处理，并返回；

客户端接收到返回数据，处理数据（如渲染页面，执行 js）；


### nodejs 处理 http 请求

get 请求和 querystring

post 请求和 postdata

路由

    - 路由和 API 的区别
      - API 不同端之间对接的一个术语
      - url（路由），输入/输出
      - 路由：API 的一部分，后端系统内部的一个模块


### nodejs 处理登录逻辑

核心：登录校验 & 登录信息存储

目录：
  
  - cookie & session
  - session 写入 redis


cookie 

  - 存储在浏览器的一段字符串（最大 5kb）
  - 跨域不共享
  
cookie 需要在服务端做的限制

  - server 设置 httpOnly
  - 注意 key 的空格，需要使用 trim 方法清除前后空格
  - 需要设置cookie 时效

cookie 存在的问题

  - 会暴露 username 之类的隐私数据：
    - 解决方法：不存储 username，只存储 userid 之类的


session 方案在本项目中存在的问题

  - session 直接占用 node 进程内存
  - 进程内存有限，访问量过大，内存溢出问题
  - 正式上线运行是多进程，进程之间 内存无法共享
  - 断电数据保存问题


### 日志

原理：使用 stream 直接存储 日志信息 到日志文件

为什么：I/O 操作相当耗费设备资源，如果不使用流，存储文件是直接存储的，如果性能比较差，会直接被卡住。如果使用 stream，可以一点点的进行 i/o 操作

常用日志分类：

    访问记录：access.log
    自定义事件：event.log
    错误日志：errors.log

日志拆分：
  
    - 按时间划分日志文件
    - 实现方式：定时任务

crontab - 定时任务（linux & mac）

  - 设置定时任务，格式：* * * * * command
  - 每个 * 的意义：
    1. 分钟
    2. 小时
    3. 日期
    4. 月份
    5. 星期几
   
  - command: 操作脚本

操作 sh 脚本分割日志

```
#!/bin/sh
cd E:\\_Coding\\my-projects\\Node.js\\node-todo\\logs
cp access.log $(date +%Y-%m-%d).access.log # 复制 acces log 的内容到 指定的文件中
echo "" > access.log # 清空原始 log的文件内容
```

日志分析

  - 如针对 access.log 日志，分析 chrome 的占比
  - 日志是按行存储的
  - 使用 nodejs 的 readline （基于 stream，效率高），可以按行读取

    ```
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

    ```


### 安全

sql 注入：威胁数据库，可能运行一些sql对数据库进行操作

  - 攻击方式：输入一个 sql 片段，最终拼接成一段攻击代码
  - 例如，输入用户名的时候，输入一段 sql 去操作数据库
  - **预防措施**：使用 mysql 的 **escape** 函数处理输入内容

XSS 攻击：窃取前端的 cookie 内容

  - 攻击方式：在页面展示内容中掺杂 js 代码，以获取网页信息
  - **预防措施：转换可以生成 js 的特殊字符，安装 XSS 库**

**密码加密：保障用户信息安全** - **重点**

  - 万一数据库被攻破，最不应该泄露的就是用户信息
  - 攻击方式：获取用户名和密码，尝试登录系统
  - 预防措施：加密密码

DDOS 攻击：硬件方面支持


### 中间件

原理：

  - 中间件其实就是个函数
  - 先把所有中间件函数收集起来
  - 再依次执行每个函数，同时在函数结尾执行下一个中间件


express 中间件原理实现：

```
const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }

  register(path) {
    // 分析第一个参数是不是路由
    // 当前的中间件注册信息
    const info = {}

    if (typeof path === 'string') {
      info.path = path
      // stack 为当前所有注册中间件的信息
      // 从第二个参数开始转换为数组
      info.stack = slice.call(arguments, 1)
    } else {
      // 如果第一个参数不是 string 类型，则认为是根路由
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }

    return info
  }

  use(...args) {
    const info = this.register(...args)
    this.routes.all.push(info)
  }

  get(...args) {
    const info = this.register(...args)
    this.routes.get.push(info)
  }

  post(...args) {
    const info = this.register(...args)
    this.routes.post.push(info)
  }

  match(method, url) {
    let stack = []

    if (url === '/favicon.ico') {
      return stack
    }

    // 获取 routes
    let curRoutes = []
    curRoutes = [...curRoutes, ...this.routes.all]
    curRoutes = [...curRoutes, ...this.routes[method]]

    curRoutes.forEach(route => {
      // 匹配访问路径
      if (url.indexOf(route.path) !== 1) {
        stack = [...stack, ...route.stack]
      }
    })

    return stack
  }

  // 核心 next 机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift()

      if (middleware) {
        middleware(req, res, next)
      }
    }

    next()
  }

  callback() {
    return (req, res) => {
      res.json = data => {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(data))
      }

      const url = req.url
      const method = req.method.toLowerCase()
      const resultList = this.match(method, url)
      this.handle(req, res, resultList)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

const app = new LikeExpress()

app.use((req, res, next) => {
  console.log('第一个中间件，命中任何路由')
  next()
})

app.get((req, res, next) => {
  console.log('命中第二个中间件')
})

app.get('/test-express', (req, res) => {
  res.json({
    data: 'ok'
  })
})

app.listen(9000, () => console.log('test-express is launching'))

```

koa 中间件原理

```
const http = require('http')

// 组合中间件
function compose(middlewareList = []) {
  return function (ctx) {
    function dispatch(i) {
      const fn = middlewareList[i]

      try {
        // 此处使用 resolve 再次包裹是避免传入的 中间件不是异步的
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn)

    return this
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    ctx.query = req.query

    return ctx
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList) // return function(ctx)

    return (req, res) => {
      const ctx = this.createContext(req, res) // ctx

      // 返回 function(ctx) 的调用结果
      // function(ctx) => dispatch(i) 
      // 调用结果 => Promise<middlewareFn(ctx, nextMiddleWareFn)>
      return this.handleRequest(ctx, fn)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback())

    server.listen(...args)
  }
}

const app = new LikeKoa2()

app.use(async (ctx, next) => {
  console.log('m1')

  await next()
})

app.use((ctx, next) => {
  console.log('m2')
})

app.listen(9000)

```

### PM2 

`pm2 start|restart|info|log name/id`

进程守护

  - 如果 server 因为出错而停止，会自动重启

配置和日志记录

  - 常用配置

    ```
    {
      "apps": {
        "name": "app",
        "script": "./bin/www.js",
        "watch": false,
        "ignore_watch": ["node_modules", "logs"],
        "error_file": "logs/errors.log",
        "out_file": "logs/out.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss"
      }
    }

    ```

多进程

  - 为何：
    - 操作系统会限制一个进程的最大可用内存
    - 无法利用多核处理器的优势

  - 多进程和 redis

    - 多个进程之间 session 不共享，可以使用 redis 实现内存共享

服务器运维

  - 中小型项目可以使用云服务


### 如何进阶？

ORM 操作数据库（Sequelize - 通过模型的方式去操作数据库，不直接写 sql）

连表操作

代码结构和流程的规范

nodejs 最佳实践


### MongoDB

文档数据库

  mysql 以表格形式存储数据
  redis 以 key-value 形式存储
  MongoDB 以文档形式存储数据，格式像 JSON

表格存储数据 vs 文档存储数据

  - 判断适合用 表格还是文档 存储数据，其实就是判断 哪些适合用 excel 来写，哪些适合用 word 来写

  - mysql 关系型，表格存储 sql 操作，硬盘
  - redis 非关系型 nosql 内存
  - mongodb 非关系 文档存储 nosql 硬盘
  - excel 适合格式规整的信息，例如 工资表，打卡记录表
  - word 适合格式松散的信息，例如需求文档，宣传方案


场景举例：

  一个简单的搜索爬虫

    - 网页的标题、关键字都可以用mysql来存储
    - 网页的内容，内容松散，可以用 mongodb 来存储

  博客项目

    - 用户 - mysql
    - 博客记录 - mysql
    - 博客内容 - mongodb


基本信息：

  - 创建一个数据库(database)
  - 创建集合(collection)
  - 文档(document)增删改查
  - 分三层管理：数据库>集合>文档
  - mongodb 数据库 对应 mysql 数据库
  - mongodb 集合 对应 mysql 表
  - mongodb 文档 对应 mysql 记录（一行数据）

命令操作：

  - 展示数据库： show dbs
  - 创建/使用数据库：use myblog
  - 查看集合：show collections
  - 新建集合：db.xxx.insert 会直接创建集合
  - 文档操作：
    - 插入：`db.blogs.insert({ "title": "123123213" })`，形式：db.表名.insert(json数据)
    - 查询：`db.blogs.find({ "title": "123" })`
      - 排序：`db.blogs.find().sort({ "_id": 1 })` 1为正序，-1为倒序
      - 可以使用正则表达式
    - 改：`db.blogs.update({ "title": "123" }, { $set: { "title": "321" } })`，update 第一个参数表示查询条件，第二个参数表示要set的数据
    - 删：`db.blogs.remove({ title: "123" })`，参数为查询条件


重要概念：

  - 数据库:
    - 可以有多个服务，每个服务可以对接多个数据库
  
  - 集合：
    - 数据库是一个服务（业务）的数据容器
    - 一个服务（业务）的数据，要分类管理
    - 如博客系统有 用户,博客 的集合

  - 文档：
    - 集合也是一个数据容器
    - 文档是单条数据，如一个用户
    - 可以被增删改查

  - bson
    - JSON 是一个常用的数据格式
    - JSON 是字符串类型
    - BSON 是 binary json -> 二进制类型的 json

  - NoSQL
    - 关系型数据库，需要学习 sql 语言
    - NoSQL 无需 sql 语句查询

mongoose

  - Schema(规范) 和 Model
  - 基于 Model 操作数据
  
  - 为何使用：
    - mongodb 数据格式过于灵活
    - 要规范化 mongodb 的数据

  - 何时使用：
    - 以格式松散数据为主，少量格式规范数据，可以这样用
    - 大量格式规范数据，建议选择 mysql

  - schema 定义数据格式的规范
  - model 规范 collection
  - 规范数据操作的 api

