const crypto = require('crypto')

// 1 - 创建密匙
const SECRET_KEY = 'Kemp_1234#'

// 2 - md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5')

  // 使用 digest 将数据变成16进制的数据
  return md5.update(content).digest('hex')
}

// 加密函数
function genSecretPassword(pwd) {
  const str = `password=${pwd}&key=${SECRET_KEY}`

  return md5(str)
}

module.exports = {
  genSecretPassword
}
