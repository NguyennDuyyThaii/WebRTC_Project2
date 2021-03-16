let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let chatTextEmoji = (io) => {
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
            // when have new group chat
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id)
        })
        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id)
        })


        //
        socket.on("chat-text-emoji", (data) => {
            // console.log(data)
            // console.log(socket.request.user)
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message
                }
                if (clients[data.groupId]) {

                    emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response)
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                }
                if (clients[data.contactId]) {
                    // gia su no mo 2 tab, thi hien ca 2 tab luon
                    emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response)
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
module.exports = chatTextEmoji;