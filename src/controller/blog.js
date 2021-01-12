const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
  const escapedAuthor = escape(author)
  const escapedKeyword = escape(`%${keyword}%`)
  let sql = `select * from blogs where 1=1 `

  if (author) {
    sql += `and author=${escapedAuthor}`
  }

  if (keyword) {
    sql += `and title like ${escapedKeyword}`
  }

  sql += `order by createtime desc;`

  return exec(sql)
}

const getDetail = async id => {
  const escapedId = escape(id)
  const sql = `select * from blogs where id=${escapedId}`
  try {
    const rows = (await exec(sql)) || []

    return rows[0]
  } catch (error) {
    return Promise.reject(error)
  }
}

const newBlog = async ({ title, content, author }) => {
  const escapedTitle = xss(escape(title))
  const escapedContent = escape(content)
  const escapedAuthor = escape(author)
  const createTime = Date.now()
  const sql = `
    insert into blogs (title, content, createtime, author) 
    values (${escapedTitle}, ${escapedContent}, '${createTime}', ${escapedAuthor});
  `
  try {
    const { insertId } = (await exec(sql)) || {}

    return { id: insertId }
  } catch (error) {
    return Promise.reject(error)
  }
}

const updateBlog = async ({ id, title, content } = {}) => {
  const escapedId = escape(id)
  const escapedTitle = escape(title)
  const escapedContent = escape(content)
  const sql = `
    update blogs set title=${escapedTitle}, content=${escapedContent} where id=${escapedId};
  `

  try {
    const { affectedRows } = (await exec(sql)) || {}

    return affectedRows > 0 || Promise.reject('更新博客失败')
  } catch (error) {
    return Promise.reject('更新博客失败')
  }
}

const delBlog = async (id, author) => {
  const escapedId = escape(id)
  const escapedAuthor = escape(author)

  // 这一步主要是避免直接使用 id 对博客进行删除操作，加强验证
  const sql = `delete from blogs where id=${escapedId} and author=${escapedAuthor};`

  try {
    const { affectedRows } = (await exec(sql)) || {}

    return affectedRows > 0 || Promise.reject('删除博客失败')
  } catch (error) {
    return Promise.reject('删除博客失败')
  }
}

module.exports = {
  getList,
  newBlog,
  getDetail,
  delBlog,
  updateBlog
}
