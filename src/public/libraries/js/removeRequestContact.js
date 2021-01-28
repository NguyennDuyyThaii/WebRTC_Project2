function decreaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;

    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContact() {
    $(".user-remove-request-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact",
            type: "delete",
            data: { uid: targetId },
            success: function(data) {
                if (data.success) {
                    $("#find-user")
                        .find(`div.user-add-new-contact[data-uid=${targetId}]`)
                        .css("display", "inline-block");
                    $("#find-user")
                        .find(`div.user-remove-request-contact[data-uid=${targetId}]`)
                        .hide();

                    decreaseNumberNotifiContact("count-request-contact-sent");
                    // actice realtime

                    socket.emit("remove-request-contact", { contactId: targetId });
                }
            },
        });
    });
}

socket.on("response-remove-request-contact", function(user) {
    $(".noti_content").find(`span[data-uid=${user.id}]`).remove();
    // prepend ngược với append
    decreaseNumberNotifiContact("count-request-contact-received");
    decreaseNumberNotification("noti_contact_counter");
    decreaseNumberNotification("noti_counter");
    // xoa o modal tab yeu cau ket ban
});