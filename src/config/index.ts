export default {
    mongo: {
        url: process.env.MONGO || "mongodb://mongo/rooms"
    },
    dataServer: 'http://data-server:8080',
}
