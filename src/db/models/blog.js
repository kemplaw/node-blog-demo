const mongoose = require('../../db/mongodb')

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const blogModel = mongoose.model('blog', BlogSchema)

module.exports = blogModel
