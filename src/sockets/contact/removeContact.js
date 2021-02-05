let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let removeContact = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // id socket alsway change ++ push socket id to array
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id)
            /**
             * 
             */
        socket.on("user-remove-contact", (data) => {
            let currentUser = {
                id: socket.request.user._id
            };
            // emit notification
            if (clients[data.contactId]) {
                // gia su no mo 2 tab, thi hien ca 2 tab luon
                clients[data.contactId].forEach(socketId => {
                    emitNotifyToArray(clients, data.contactId, io, "response-user-remove-contact", currentUser)
                });
            }
        });
        /**
         * 
         */
        socket.on("disconnect", () => {
            //remove socket Io when disconnect
            clients = removeSocketIdFromArray(clients, currentUserId, socket)
        })
    });
};

module.exports = removeContact