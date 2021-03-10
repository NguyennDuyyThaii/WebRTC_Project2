/**
 * declare objects
 */
const configViewEngine = require("./configs/viewEngine");
const initRouter = require("./routes/web");
const connectDB = require("./configs/connectDB");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const session = require("./configs/session");
const http = require("http");
const socketIO = require("socket.io");
const initSockets = require("./sockets/index");
const cookieParser = require("cookie-parser");
const configSocketio = require("./configs/socketio");
const events = require("events");

/**
 *
 */
const express = require("express");
const app = express();

events.EventEmitter.defaultMaxListeners = 30
    /**
     * socket io vs expressApp
     */
const server = http.createServer(app);
const io = socketIO(server);
/**
 * connectDB
 */
connectDB();
/**
 * config session
 */
session.configSession(app);
/**
 * config view engine
 */
configViewEngine(app);
/**
 * config body-parser
 */
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * connect flash
 */
app.use(connectFlash());
/**
 * cookie-parser
 */
app.use(cookieParser());
/**
 * config passport
 */
app.use(passport.initialize());
app.use(passport.session());
/**
 * config router
 */
initRouter(app);
/**
 * config socket Io
 */
configSocketio(io, cookieParser, session.sessionStore)
    /**
     * init all sockets
     */

initSockets(io);
/**
 * port setup
 */
server.listen(process.env.APP_PORT, () => {
    console.log(`Server is starting on port ${process.env.APP_PORT}`);
});