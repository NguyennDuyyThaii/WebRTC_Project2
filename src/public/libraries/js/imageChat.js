function bufferToBase64(buffer) {
    return btoa(
        new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
        )
    );
}

function imageChat(divId) {
    $(`#image-chat-${divId}`)
        .unbind("change")
        .on("change", function() {
            let fileData = $(this).prop("files")[0];
            let math = ["image/png", "image/jpg", "image/jpeg"];
            let limit = 1048576; // byte = 1MB

            if ($.inArray(fileData.type, math) === -1) {
                alertify.notify(
                    "Kiểu file không hợp lệ, chỉ chấp nhận png, jpg,jpeg",
                    "error",
                    7
                );
                $(this).val(null);
                return false;
            }
            if (fileData.size > limit) {
                alertify.notify(
                    "ảnh upload có dung lượng quá lớn, không phù hợp",
                    "error",
                    7
                );
                $(this).val(null);
                return false;
            }

            let targetId = $(this).data("chat");

            let isChatGroup = false;

            let messageFormData = new FormData();
            messageFormData.append("my-image-chat", fileData);
            messageFormData.append("uid", targetId);

            if ($(this).hasClass("chat-in-group")) {
                messageFormData.append("isChatGroup", true);
                isChatGroup = true;
            }

            $.ajax({
                url: "/messages/add-new-image",
                type: "post",
                cache: false,
                contentType: false,
                processData: false,
                data: messageFormData,
                success: function(data) {
                    //console.log(data);
                    let dataToEmit = {
                        message: data.message,
                    };
                    // data.data => buffer => let's console.log() => u will understand the problem
                    let imageChat = `<img src="data:${
            data.message.file.contentType
          };base64,
                ${bufferToBase64(data.message.file.data.data)}" 
                class="show-image-chat">`;
                    let messageOfMe = $(`<div class="bubble me bubble-image-file"
                data-mess-id="${data.message._id}">
           </div>`);
                    if (isChatGroup) {
                        messageOfMe.html(`
                   <img src="/images/users/${data.message.sender.avatar}" 
                   alt="" class="avatar-small" title="${data.message.sender.name}">
                   `);
                        messageOfMe.text(imageChat);
                        increaseNumberMessageGroup(divId);
                        dataToEmit.groupId = targetId;
                    } else {
                        messageOfMe.html(imageChat);
                        dataToEmit.contactId = targetId;
                    }

                    //step 2: append
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                    nineScrollRight(divId);

                    //step 4
                    //$(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
                    $(`.person[data-chat=${divId}]`)
                        .find("span.preview")
                        .html("Hình Ảnh ...");

                    //step 5: move new conversation to the top
                    $(`.person[data-chat=${divId}]`).on(
                        "nguyenduythai.moveConversationToTop",
                        function() {
                            let dataToMove = $(this).parent();
                            $(this).closest("ul").prepend(dataToMove);
                            $(this).off("nguyenduythai.moveConversationToTop");
                        }
                    );
                    $(`.person[data-chat=${divId}]`).trigger(
                        "nguyenduythai.moveConversationToTop"
                    );


                    // step 6: Emit realtime
                    socket.emit("chat-image", dataToEmit)


                    // step 9: add to modal image

                    let imageChatToAddModal = `<img src="data:${
                        data.message.file.contentType
                      };base64, ${bufferToBase64(data.message.file.data.data)}">`
                    $(`#imagesModal_${divId}`).find('div.all-images').append(imageChatToAddModal)
                },
                error: function(error) {
                    alertify.notify(error.responseText, "error", 7);
                },
            });
        });
}

$(document).ready(function() {
    socket.on("response-chat-image", function(response) {
        let divId = ""
            //step 1
        let messageOfYou = $(`<div class="bubble you bubble-image-file"
         data-mess-id="${response.message._id}">
    </div>`)
        let imageChat = `<img src="data:${
        response.message.file.contentType
      };base64,
            ${bufferToBase64(response.message.file.data.data)}" 
            class="show-image-chat">`;

        if (response.currentGroupId) {
            messageOfYou.html(`
            <img src="/images/users/${response.message.sender.avatar}" 
            alt="" class="avatar-small" title="${response.message.sender.name}">
            `)
            messageOfYou.html(imageChat)
            divId = response.currentGroupId
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                increaseNumberMessageGroup(divId)
            }
        } else {
            messageOfYou.html(imageChat)
            divId = response.currentUserId
        }

        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            // step 2: append message data to screen
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou)
            nineScrollRight(divId)
                //$(`.person[data-chat=${divId}]`).find("span.time").css({"color":"#e74c3c", "font-weight":"bold"})
                //.html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
        }

        //step 4:  change data preview $ time in leftside
        //$(`.person[data-chat=${divId}]`).find("span.time")
        //.html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...")

        //step 5: move new conversation to the top
        $(`.person[data-chat=${divId}]`).on("nguyenduythai.moveConversationToTop", function() {
            let dataToMove = $(this).parent()
            $(this).closest("ul").prepend(dataToMove)
            $(this).off("nguyenduythai.moveConversationToTop")
        })
        $(`.person[data-chat=${divId}]`).trigger("nguyenduythai.moveConversationToTop")

        //step 9
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            let imageChatToAddModal = `<img src="data:${
            response.message.file.contentType
          };base64, ${bufferToBase64(response.message.file.data.data)}">`
            $(`#imagesModal_${divId}`).find('div.all-images').append(imageChatToAddModal)
        }
    })
})