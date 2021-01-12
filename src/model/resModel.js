class BaseModel {
  constructor(data = null, msg = '') {
    this.data = data
    this.message = msg
  }
}

class SuccessModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg)
    this.errno = 0
  }
}

class ErrorModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg)
    this.errno = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}
