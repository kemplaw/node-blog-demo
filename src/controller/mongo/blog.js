const xss = require('xss')
const blogModel = require('../../db/models/blog')

const getList = async (author, keyword) => {
  const whereOption = {}

  if (author) {
    whereOption.author = author
  }

  if (keyword) {
    whereOption.keyword = new RegExp(keyword)
  }

  const list = await blogModel.find(whereOption).sort({ _id: -1 })

  return list
}

const getDetail = async id => {
  const res = await blogModel.findById(id)

  return res
}

const newBlog = async ({ title, content, author }) => {
  const escapedTitle = xss(title)
  const escapedContent = xss(content)

  try {
    const blog = await blogModel.create({
      title: escapedTitle,
      content: escapedContent,
      author
    })

    return {
      id: blog._id
    }
  } catch (error) {
    return Promise.reject(JSON.stringify(error))
  }
}

const updateBlog = async ({ id, title, content } = {}) => {
  const escapedTitle = xss(title)
  const escapedContent = xss(content)

  const blog = await blogModel.findOneAndUpdate(
    {
      _id: id
    },
    {
      title: escapedTitle,
      content: escapedContent
    },
    { new: true }
  )

  if (!blog) return false

  return true
}

const delBlog = async (id, author) => {
  const blog = await blogModel.findOneAndDelete({
    _id: id,
    author
  })

  if (!blog) return false

  return true
}

module.exports = {
  getList,
  newBlog,
  getDetail,
  delBlog,
  updateBlog
}
