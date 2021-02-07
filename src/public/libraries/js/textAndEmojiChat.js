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
                console.log(data.message)
            }).fail(function(response) {
                alertify.notify(response.responseText, "error", 7)
            })
        }
    })
}