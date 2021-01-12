const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/mongo/blog')
const { loginValidator } = require('../middlewares/loginValidator')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = async req => {
  const domain = '/api/blog'
  const { method, path, query = {}, body } = req
  const { id } = query

  if (method === 'GET' && path === `${domain}/list`) {
    const { author = '', keyword = '' } = query

    try {
      const listData = await getList(author, keyword)

      return new SuccessModel(listData)
    } catch (error) {
      return new ErrorModel(null, error)
    }
  }

  if (method === 'GET' && path === `${domain}/detail`) {
    try {
      const data = await getDetail(id)

      return new SuccessModel(data)
    } catch (error) {
      return new ErrorModel(null, error)
    }
  }

  if (method === 'POST' && path === `${domain}/new`) {
    // TODO: fake data, wait user completed
    const validResult = loginValidator(req) // 登录验证中间件

    if (validResult) {
      return validResult
    }

    req.body.author = req.session.username

    try {
      console.log(body)
      const data = await newBlog(body)

      return new SuccessModel(data, '创建成功')
    } catch (error) {
      return new ErrorModel(null, error)
    }
  }

  if (method === 'POST' && path === `${domain}/update`) {
    const validResult = loginValidator(req) // 登录验证中间件

    if (validResult) {
      return validResult
    }

    try {
      await updateBlog(body)

      return new SuccessModel(null, '更新成功')
    } catch (error) {
      return new ErrorModel(null, error)
    }
  }

  if (method === 'POST' && path === `${domain}/del`) {
    const validResult = loginValidator(req) // 登录验证中间件

    if (validResult) {
      return validResult
    }

    req.body.author = req.session.username

    const result = await delBlog(body.id, req.body.author)

    return result ? new SuccessModel(null, '删除成功') : new ErrorModel(null, '删除失败')
  }
}

module.exports = handleBlogRouter
