let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let newGroupChat = (io) => {
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
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id)
                //
            let response = {
                groupChat: data.groupChat
            }
            data.groupChat.members.forEach(item => {
                // k ban cai socket cho chinh thang tao nhom
                if (clients[item.userId] && item.userId != socket.request.user._id) {
                    emitNotifyToArray(clients, item.userId, io, "response-new-group-created", response)
                }
            })
        });

        socket.on("member-received-group-chat", (data) => {
                clients = pushSocketIdToArray(clients, data.groupChatId, socket.id)
            })
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
module.exports = newGroupChat;