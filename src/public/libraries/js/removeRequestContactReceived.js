function decreaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;

    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").unbind('click').on("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: { uid: targetId },
            success: function(data) {
                if (data.success) {
                    // chua muon lam
                    //$(".noti_content").find(`div[data-uid=${targetId}]`).remove();
                    //$("ul.list-notifications").find(`li>div[data-uid=${targetId}]`).parent().remove()
                    //decreaseNumberNotification("noti_counter", 1);
                    decreaseNumberNotification("noti_contact_counter", 1);
                    decreaseNumberNotifiContact("count-request-contact-received");
                    // actice realtime

                    $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove()

                    socket.emit("remove-request-contact-received", { contactId: targetId });
                }
            },
        });
    });
}

socket.on("response-remove-request-contact-received", function(user) {

    $("#find-user")
        .find(`div.user-add-new-contact[data-uid=${user.id}]`)
        .css("display", "inline-block");
    $("#find-user")
        .find(`div.user-remove-request-contact-received[data-uid=${user.id}]`)
        .hide();


    $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove()
        // prepend ngược với append
    decreaseNumberNotifiContact("count-request-contact-sent");
    decreaseNumberNotification("noti_contact_counter", 1);

    // xoa o modal tab yeu cau ket ban
});

$(document).ready(function() {
    removeRequestContactReceived()
})