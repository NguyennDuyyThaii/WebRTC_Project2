const mongoose = require("mongoose")
const bluebird = require("bluebird")

let connectDB = () => {
    mongoose.Promise = bluebird
        /**
         * mongodb://localhost:27017/webRTC
         */
        // let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    let URI = `mongodb://nguyenthai2k:nguyenthai2k@cluster0-shard-00-00.8snuz.mongodb.net:27017,cluster0-shard-00-01.8snuz.mongodb.net:27017,cluster0-shard-00-02.8snuz.mongodb.net:27017/webRTC?replicaSet=atlas-iid57u-shard-0&ssl=true&authSource=admin`
    return mongoose.connect(URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true })
}
module.exports = connectDB