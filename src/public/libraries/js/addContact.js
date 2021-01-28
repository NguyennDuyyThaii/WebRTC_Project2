function increaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue += 1;

    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function addContact() {
    $(".user-add-new-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.post("/contact/add-new-contact", { uid: targetId }, function(data) {
            if (data.success) {
                $("#find-user")
                    .find(`div.user-add-new-contact[data-uid=${targetId}]`)
                    .hide();
                $("#find-user")
                    .find(`div.user-remove-request-contact[data-uid=${targetId}]`)
                    .css("display", "inline-block");

                increaseNumberNotifiContact("count-request-contact-sent");

                // actice realtime
                socket.emit("add-new-contact", { contactId: targetId });
            }
        });
    });
}

socket.on("response-add-new-contact", function(user) {
    let notif = `<span data-uid="${user.id}">
    <img class="avatar-small" src="../../libraries/images/users/${user.avatar}" alt=""> 
    <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
</span><br><br><br>`;
    // prepend ngược với append
    $(".noti_content").prepend(notif)

    increaseNumberNotifiContact("count-request-contact-received")
    increaseNumberNotification("noti_contact_counter")
    increaseNumberNotification("noti_counter")
});