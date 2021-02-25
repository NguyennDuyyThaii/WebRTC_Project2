let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let typingOff = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // id socket alsway change ++ push socket id to array
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id)
        socket.request.user.chatGroupIds.forEach(item => {
                clients = pushSocketIdToArray(clients, item._id, socket.id)
            })
            /**
             * 
             */
        socket.on("user-is-not-typing", (data) => {
            //console.log(data)
            // console.log(socket.request.user)
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id
                }
                if (clients[data.groupId]) {

                    emitNotifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response)
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                }
                if (clients[data.contactId]) {
                    // gia su no mo 2 tab, thi hien ca 2 tab luon
                    emitNotifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response)
                }
            }

        });
        /**
         * 
         */
        socket.on("disconnect", () => {
            //remove socket Io when disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
            socket.request.user.chatGroupIds.forEach(item => {
                clients = removeSocketIdFromArray(clients, item._id, socket)
            })
        })
    });
};
module.exports = typingOff;