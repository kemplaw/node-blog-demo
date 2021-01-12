const querystring = require('querystring')
const handleBlogRouter = require('./src/routes/blog')
const handleUserRouter = require('./src/routes/user')
const { access } = require('./src/utils/log')
const { getFromRedis, setToRedis } = require('./src/db/redis')

const DAY_TIMES = 24 * 3600 * 1000

const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + DAY_TIMES * 7)

  return d.toUTCString()
}

const setCookieToReq = (cookieStr, req) => {
  if (!cookieStr) return

  cookieStr.split(';').forEach(value => {
    if (!value) return

    const [key, v] = value.split('=') || []
    const trimKey = key.trim()
    const trimValue = v.trim()

    req.cookie[trimKey] = trimValue
  })
}

const getPostData = req => {
  const { method, headers } = req
  const isValidRequest = method === 'POST' && headers['content-type'] === 'application/json'

  return new Promise(resolve => {
    if (!isValidRequest) {
      return resolve({})
    }

    let postData = ''

    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(postData))
      } catch (error) {
        resolve({})
      }
    })
  })
}

const serverHandle = async (req, res) => {
  const { url, headers } = req

  // 记录 access log
  access(`${req.method} -- ${url} -- ${headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式
  res.setHeader('content-type', 'application/json')
  req.path = url.split('?')[0]
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = headers.cookie || ''

  setCookieToReq(cookieStr, req)

  // 解析 session
  // let needSetCookie = false // 判断 cookie 中是否存在 userId，不存在则需要设置 cookie
  // let userId = req.cookie.userId

  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }

  // req.session = SESSION_DATA[userId]

  // 解析 session （redis version）
  let needSetCookie = false
  let userId = req.cookie.userId

  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 session
    setToRedis(userId, {})
  }

  // 获取 session
  req.sessionId = userId
  const redisRes = await getFromRedis(req.sessionId)

  if (redisRes) {
    req.session = { ...redisRes }
  } else {
    setToRedis(req.sessionId, {})
    req.session = {}
  }

  req.body = await getPostData(req)

  const blogResult = await handleBlogRouter(req, res)

  if (blogResult) {
    if (needSetCookie) {
      res.setHeader(
        'Set-Cookie',
        `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
      )
    }

    res.end(JSON.stringify(blogResult))

    return
  }

  // 处理 user
  const userResult = await handleUserRouter(req, res)

  if (userResult) {
    if (needSetCookie) {
      res.setHeader(
        'Set-Cookie',
        `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
      )
    }

    res.end(JSON.stringify(userResult))

    return
  }

  // 处理 blog 路由

  res.writeHead(404, { 'content-type': 'text/plain' })
  res.write('404 not found')
  res.end()
}

module.exports = serverHandle
