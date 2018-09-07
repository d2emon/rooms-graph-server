'use strict';
export default {
    mongo: {
        // url: "mongodb://mongo/rooms"
        url: process.env.MONGO || "mongodb://mongo/rooms"
    }
}
