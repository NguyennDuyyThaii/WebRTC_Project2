function textAndEmojiChat(divId) {
    $("#emojionearea").unbind("keyup").on("keyup", function(e) {
        if (element.which === 13) {
            let targetId = $(`#write-chat-${chatId}`).data("chat")
            let messageval = $(`#write-chat-${chatId}`).val()

            if (!targetId.length || !messageval.length) {
                return false
            }

            let dataTextEmojiForSent = {
                uid: targetId,
                messageval: messageval
            }
            if ($(`#write-chat-${chatId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSent.isChatGroup = true
            }

            $.post('/message/add-new-text-emoji', dataTextEmojiForSent, function(data) {

            }).fail(function(response) {

            })
        }
    })
}