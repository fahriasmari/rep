const redis = require('redis');
const {
    promisify
} = require('util')

const client = redis.createClient({
    host: 'localhost',
    port: 6379
})

const myredis = () => {

    if (client) {
        console.log('redis connected')
    }
}

const GET_ASYNC = promisify(client.get).bind(client)
const SET_ASYNC = promisify(client.setex).bind(client)

module.exports = {
    myredis,
    GET_ASYNC,
    SET_ASYNC,
    client
}