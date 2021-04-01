const session = require("express-session")
const connectMongo = require("connect-mongo")

let MongoStore = connectMongo(session)

let sessionStore = new MongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    // url: `mongodb://nguyenthai2k:nguyenthai2k@cluster0-shard-00-00.8snuz.mongodb.net:27017,cluster0-shard-00-01.8snuz.mongodb.net:27017,cluster0-shard-00-02.8snuz.mongodb.net:27017/webRTC?replicaSet=atlas-iid57u-shard-0&ssl=true&authSource=admin`,
    autoReconnect: true
})
let configSession = (app) => {
    app.use(session({
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }))
}

module.exports = {
    configSession: configSession,
    sessionStore: sessionStore
}