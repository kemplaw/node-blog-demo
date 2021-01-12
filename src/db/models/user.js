const connectedMongoose = require('../mongodb')

const UserSchema = connectedMongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    realname: {
      type: String
    }
  },
  { timestamps: true }
)

const UserModel = connectedMongoose.model('user', UserSchema)

module.exports = UserModel
