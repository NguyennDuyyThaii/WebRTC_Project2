let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let userOnOff = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // id socket alsway change ++ push socket id to array
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id)
        socket.request.user.chatGroupIds.forEach(item => {
            clients = pushSocketIdToArray(clients, item._id, socket.id)
        })

        // when have new group chat
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id)
        })
        socket.on("member-received-group-chat", (data) => {
                clients = pushSocketIdToArray(clients, data.groupChatId, socket.id)
            })
            // vi thang nay no can load lai tranf
        socket.on("check-status", () => {
            //console.log(Object.keys(clients)) => lay tat ca cai key cua object thoi
            // step01: Emit to user when logging or f5 web
            socket.emit("server-send=list-user-online", Object.keys(clients))
                // step02: Emit to all another users when has new user online
            socket.broadcast.emit("server-send-list-user-online", socket.request.user._id)
        })


        socket.on("disconnect", () => {
            //remove socket Io when disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
            socket.request.user.chatGroupIds.forEach(item => {
                    clients = removeSocketIdFromArray(clients, item._id, socket)
                })
                // step03: Emit to all another users when has new user offline
            socket.broadcast.emit("server-send-list-user-offline", socket.request.user._id)
        })
    });
};
module.exports = userOnOff;