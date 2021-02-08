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
                } else {
                    messageOfMe.text(data.message.text)
                }
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe)
                nineScrollRight(divId)

                //step 3
                $(`#write-chat-${divId}`).val("")
                $(".emojionearea").find(".emojionearea-editor").text("")


                //step 4
                //$(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                $(`.person[data-chat=${divId}]`).find("span.preview").text(data.message.text)

                //step 5: move new conversation to the top
                $(`.person[data-chat=${divId}]`).on("click.moveConversationToTop", function() {
                    let dataToMove = $(this).parent()
                    $(this).closest("ul").prepend(dataToMove)
                    $(this).off("click.moveConversationToTop")
                })
                $(`.person[data-chat=${divId}]`).click()
            }).fail(function(response) {
                alertify.notify(response.responseText, "error", 7)
            })
        }
    })
}