const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

const client = redis.createClient(REDIS_CONF.port, REDIS_CONF.host, {
  password: REDIS_CONF.password
})

client.on('error', err => {
  console.error(`redis error: ${err}`)
})

function setToRedis(key, val) {
  const stringifyVal = typeof val === 'object' ? JSON.stringify(val) : val

  client.set(key, stringifyVal, redis.print)
}

function getFromRedis(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, val) => {
      if (err) {
        return reject(err)
      }

      if (typeof val === 'string' && val === 'null') return resolve(null)

      try {
        resolve(JSON.parse(val))
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  setToRedis,
  getFromRedis
}
