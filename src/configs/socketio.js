const passportSocketIO = require("passport.socketio");

let configSocketio = (io, cookieParser, sessionStore) => {
    io.use(
        passportSocketIO.authorize({
            cookieParser: cookieParser, // the same middleware you registrer in express
            key: process.env.SESSION_KEY,
            secret: process.env.SESSION_SECRET, // the session_secret to parse the cookie
            store: sessionStore, // we NEED to use a sessionstore. no memorystore please
            // *optional* callback on fail/error - read more below
        })
    );
}

module.exports = configSocketio