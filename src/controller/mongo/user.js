const { genSecretPassword } = require('../../utils/crypto')
const UserModel = require('../../db/models/user')

const login = async (username, password) => {
  const cryptoPassword = genSecretPassword(password)
  // 加密密码

  const userRes = await UserModel.findOne({
    username,
    password: cryptoPassword
  })

  console.log(userRes)

  if (!userRes) {
    return {}
  }

  return userRes
}

const signIn = async ({ username, realname, password }) => {
  let cryptoPassword = genSecretPassword(password)

  const user = await UserModel.create({
    username,
    realname,
    password: cryptoPassword
  })

  if (!user) return {}

  return {
    username,
    realname
  }
}

module.exports = {
  login,
  signIn
}
