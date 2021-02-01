let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let addNewContact = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // id socket alsway change ++ push socket id to array
        let currentUserId = socket.request.user._id;
        clients = pushSocketIdToArray(clients, currentUserId, socket.id)
            /**
             * 
             */
        socket.on("add-new-contact", (data) => {
            // console.log(data)
            // console.log(socket.request.user)

            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !== null) ? socket.request.user.address : ""
            };
            // emit notification
            if (clients[data.contactId]) {
                // gia su no mo 2 tab, thi hien ca 2 tab luon
                emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser)
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
module.exports = addNewContact;