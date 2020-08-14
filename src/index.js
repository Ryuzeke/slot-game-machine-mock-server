import GameServerHandler from './game-server-handler'
const fastify = require('fastify')()
fastify.register(require('fastify-websocket'))
fastify.get('/', { websocket: true }, GameServerHandler)
fastify.listen(3000, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})