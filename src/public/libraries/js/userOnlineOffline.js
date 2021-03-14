// step01

socket.on("server-send=list-user-online", function(listUsersId) {
    listUsersId.forEach(userId => {
        $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online")
        $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online")
    })
})

// step02
socket.on("server-send-list-user-online", function(userId) {
        $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online")
        $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online")
    })
    // step03
socket.on("server-send-list-user-offline", function(userId) {
    $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online")
    $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online")
})