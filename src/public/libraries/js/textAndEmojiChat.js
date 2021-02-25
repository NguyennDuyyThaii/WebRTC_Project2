function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function(e) {
        if (e.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat")
            let messageVal = $(`#write-chat-${divId}`).val()

            if (!targetId.length || !messageVal.length) {
                return false
            }

            let dataTextEmojiForSent = {
                uid: targetId,
                messageVal: messageVal
            }
            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSent.isChatGroup = true
            }

            $.post('/message/add-new-text-emoji', dataTextEmojiForSent, function(data) {
                let dataToEmit = {
                        message: data.message
                    }
                    // step 01
                let messageOfMe = $(`<div class="bubble me"
                 data-mess-id="${data.message._id}">
            </div>`)
                if (dataTextEmojiForSent.isChatGroup) {
                    messageOfMe.html(`
                    <img src="/images/users/${data.message.sender.avatar}" 
                    alt="" class="avatar-small" title="${data.message.sender.name}">
                    `)
                    messageOfMe.text(data.message.text)
                    increaseNumberMessageGroup(divId)
                    dataToEmit.groupId = targetId
                } else {
                    messageOfMe.html(data.message.text)
                    dataToEmit.contactId = targetId
                }
                //step 2: append
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe)
                nineScrollRight(divId)

                //step 3
                $(`#write-chat-${divId}`).val("")
                $(".emojionearea").find(".emojionearea-editor").text("")


                //step 4
                //$(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").text(data.message.text)

                //step 5: move new conversation to the top
                $(`.person[data-chat=${divId}]`).on("nguyenduythai.moveConversationToTop", function() {
                    let dataToMove = $(this).parent()
                    $(this).closest("ul").prepend(dataToMove)
                    $(this).off("nguyenduythai.moveConversationToTop")
                })
                $(`.person[data-chat=${divId}]`).trigger("nguyenduythai.moveConversationToTop")

                // step 6: Emit realtime
                socket.emit("chat-text-emoji", dataToEmit)

                // step 7: Emit remove typing real-time
                typingOff(divId);

                // step 8: If this has typing, remove that imeidate
                let check = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif")
                    //kiem tra neu no ton tai
                if (check.length) {
                    check.remove();
                }
            }).fail(function(response) {
                alertify.notify(response.responseText, "error", 7)
            })
        }
    })
}
$(document).ready(function() {
    socket.on("response-chat-text-emoji", function(response) {
        let divId = ""
        let messageOfYou = $(`<div class="bubble you"
        data-mess-id="${response.message._id}">
   </div>`)
        if (response.currentGroupId) {
            messageOfYou.html(`
           <img src="/images/users/${response.message.sender.avatar}" 
           alt="" class="avatar-small" title="${response.message.sender.name}">
           `)
            messageOfYou.text(response.message.text)
            divId = response.currentGroupId
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                increaseNumberMessageGroup(divId)
            }
        } else {
            messageOfYou.text(response.message.text)
            divId = response.currentUserId
        }
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            // step 2: append message data to screen
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou)
            nineScrollRight(divId)
                //$(`.person[data-chat=${divId}]`).find("span.time").css({"color":"#e74c3c", "font-weight":"bold"})
                //.html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
        }

        //step 3: remove all data at input: nothing to code

        //step 4:  change data preview $ time in leftside
        //$(`.person[data-chat=${divId}]`).find("span.time")
        //.html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
        $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text)

        //step 5: move new conversation to the top
        $(`.person[data-chat=${divId}]`).on("nguyenduythai.moveConversationToTop", function() {
            let dataToMove = $(this).parent()
            $(this).closest("ul").prepend(dataToMove)
            $(this).off("nguyenduythai.moveConversationToTop")
        })
        $(`.person[data-chat=${divId}]`).trigger("nguyenduythai.moveConversationToTop")

        //step 6
        //step7
        //step8
    })
})