const { ErrorModel } = require('../model/resModel')

function loginValidator(req) {
  if (!req.session || !req.session.username) {
    return new ErrorModel(null, '尚未登录')
  }
}

module.exports = {
  loginValidator
}
