const env = process.env.NODE_ENV

let MYSQL_CONF = null
let REDIS_CONF = null

if (env === 'development') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '944197511',
    port: 3306,
    database: 'blog'
  }

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1',
    password: '944197511'
  }
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '944197511',
    port: 3306,
    database: 'blog'
  }

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1',
    password: '944197511'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
