let { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } = require("./../../helpers/socketsHelpers")
let chatVideo = (io) => {
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
        socket.on("caller-check-listener-online-or-not", (data) => {

            if (clients[data.listenerId]) {
                // onlines
                let response = {
                    callerId: socket.request.user._id,
                    listenerId: data.listenerId,
                    callerName: data.callerName
                }

                emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response)
            } else {
                // offline
                // step 02 of roadmap: User 02 offline, cancel call
                socket.emit("server-send-listener-is-offline")
            }
        });
        // step 04
        socket.on("listener-emit-peer-id-to-server", (data) => {
            let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                // step 05: Server send peerId of User02 to User01
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-listener-to-caller", response)
            }
        });
        // step 06
        socket.on("caller-request-call-to-server", (data) => {
            let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                // step 08: Server send request call to User02
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response)
            }
        });
        // step 07
        socket.on("caller-cancel-request-call-to-server", (data) => {
            let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                // step 09: Server send cancel request call to User02
            if (clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response)
            }
        });
        // step 10
        socket.on("listener-reject-request-call-to-server", (data) => {
            let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                // step 12: Server send reject call of User02 to User01
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response)
            }
        });
        // step 11
        socket.on("listener-accept-request-call-to-server", (data) => {
            let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                // step 13: Server send accept call of User02 to User01
            if (clients[data.callerId]) {
                emitNotifyToArray(clients, data.callerId, io, "server-send-accept-call-to-caller", response)
            }
            // step 14: Server send accept call to User02
            if (clients[data.listenerId]) {
                emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-call-to-listener", response)
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
module.exports = chatVideo;