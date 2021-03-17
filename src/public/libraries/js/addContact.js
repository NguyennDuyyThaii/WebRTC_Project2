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
                    .find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`)
                    .css("display", "inline-block");
                increaseNumberNotification("noti_contact_counter", 1);
                increaseNumberNotifiContact("count-request-contact-sent");
                //increaseNumberNotifiContact("count-request-contact-received");

                let userInfoHTML = $("#find-user")
                    .find(`ul li[data-uid=${targetId}]`)
                    .get(0).outerHTML;
                $("#request-contact-sent").find("ul").prepend(userInfoHTML);
                removeRequestContactSent()

                // actice realtime
                socket.emit("add-new-contact", { contactId: targetId });
            }
        });
    });
}

socket.on("response-add-new-contact", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${user.id}">
    <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
    <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
</div>`;
    // prepend ngược với append
    $(".noti_content").prepend(notif);
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);

    increaseNumberNotifiContact("count-request-contact-received");
    increaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);

    let userInfoHTML = `
    <li class="_contactList" data-uid="${user.id}">
<div class="contactPanel">
<div class="user-avatar">
<img src="images/users/${user.avatar}
            " alt="">
</div>
<div class="user-name">
<p>
${user.username}
</p>
</div>
<br>
<div class="user-address">
<span>${user.address}
                    </span>
</div><br>
<div class="user-approve-request-contact-received" data-uid="${user.id}">
Chấp nhận
</div>
<div class="user-reject-request-contact-received
                    action-danger" data-uid="${user.id}">
Xóa yêu cầu
</div>
</div>
</li>
    `;
    $("#request-contact-received").find("ul").prepend(userInfoHTML)
    removeRequestContactReceived()
    approveRequestContactReceived()
});