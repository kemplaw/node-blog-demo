const { login, signIn } = require('../controller/mongo/user')
const { ErrorModel, SuccessModel } = require('../model/resModel')
const { setToRedis } = require('../db/redis')

const handleUserRouter = async req => {
  const { method, path, body = {} } = req
  const domain = '/api/user'

  if (method === 'POST' && path === `${domain}/login`) {
    const { username, password } = body
    const result = (await login(username, password)) || {}

    if (result.username) {
      req.session = {
        username,
        realname: result.realname
      }

      setToRedis(req.sessionId, req.session)

      return new SuccessModel(result, '登录成功')
    }

    return new ErrorModel(null, '用户名或密码错误')
  }

  if (method === 'POST' && path === `${domain}/signIn`) {
    if (!req.body.username) return new ErrorModel(null, '注册失败')

    const result = await signIn(req.body)
    const { username } = result

    return username ? new SuccessModel(result, '注册成功') : new ErrorModel(null, '注册失败')
  }

  if (method === 'POST' && path === `${domain}/logout`) {
    req.session = {}
    setToRedis(req.sessionId, null)

    return new SuccessModel(null, '退出登录成功')
  }
}

module.exports = handleUserRouter
