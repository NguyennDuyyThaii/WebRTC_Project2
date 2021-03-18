$(document).ready(function() {
    $("#link-read-more-all-chat").bind("click", function() {
        let skipPersonNal = $("#all-chat").find("li:not(.group-chat)").length
        let skipGroup = $("#all-chat").find("li.group-chat").length

        $("#link-read-more-contacts").css("display", "none")
        $(".read-more-all-chat-loader").css("display", "inline-block")

        $.get(`/message/read-more-all-chat?skipPersonNal=${skipPersonNal}&skipGroup=${skipGroup}`, function(data) {

            if (data.leftSideData.trim() === "") {
                alertify.notify("Bạn không còn cuộc trò chuyện nào nữa", "error", 7)
                $("#link-read-more-contacts").css("display", "inline-block")
                $(".read-more-all-chat-loader").css("display", "none")
                return false
            }
            // step01: Handle leftSide
            $("#all-chat").find("ul").append(data.leftSideData)
                // step02: call scroll left
            resizeNineScrollLeft()
            nineScrollLeft()
                // step03: Handle rightSide
            $("#screen-chat").append(data.rightSideData)
                // step04: call scroll right
            changeScreenChat()

            $("body").append(data.imageSideData) // vì khai báo ở index.ejs
            gridPhotos(5)
            $("body").append(data.attachmentSideData) // vvì khai báo ở index.ejs

            socket.emit("check-status")

            $("#link-read-more-contacts").css("display", "inline-block")
            $(".read-more-all-chat-loader").css("display", "none")
        })
    })
})