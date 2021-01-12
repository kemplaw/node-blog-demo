const { exec, escape } = require('../db/mysql')
const { genSecretPassword } = require('../utils/crypto')

const login = async (username, password) => {
  const escapedUsername = escape(username)
  let escapedPassword = genSecretPassword(password)

  // 加密密码
  escapedPassword = escape(escapedPassword)

  console.log(escapedPassword)

  const sql = `select username, realname from users where username=${escapedUsername} and password=${escapedPassword};`

  try {
    const [data] = (await exec(sql)) || []

    return data
  } catch (error) {
    return {}
  }
}

const signIn = async ({ username, realname, password }) => {
  const escapedUsername = escape(username)
  let escapedPassword = genSecretPassword(password)
  const escapedRealname = escape(realname)

  // 加密密码
  escapedPassword = escape(escapedPassword)

  const sql = `
    insert into users (username, password, realname) 
    values (${escapedUsername}, ${escapedPassword}, ${escapedRealname});
  `

  try {
    const { insertId } = (await exec(sql)) || {}

    return insertId
      ? {
          username
        }
      : {}
  } catch (error) {
    return {}
  }
}

module.exports = {
  login,
  signIn
}
