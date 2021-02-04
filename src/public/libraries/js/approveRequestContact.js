function decreaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;

    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function approveRequestContactReceived() {
    $(".user-approve-request-contact-received")
        .unbind("click")
        .on("click", function() {
            let targetId = $(this).data("uid");
            $.ajax({
                url: "/contact/approve-request-contact-received",
                type: "put",
                data: { uid: targetId },
                success: function(data) {
                    if (data.success) {

                        let userInfo = $("#request-contact-received").find(
                            `ul li[data-uid=${targetId}]`
                        );
                        $(userInfo)
                            .find("div.user-approve-request-contact-received")
                            .remove();
                        $(userInfo)
                            .find("div.user-remove-approve-request-contact-received")
                            .remove();
                        $(userInfo).find("div.contactPanel").append(`
                            <div class="user-talk" data-uid="
                                             ${targetId}
        
                                                    ">
                                                Trò chuyện
</div>
<div class="user-remove-contact
        action-danger" data-uid="
        ${targetId}
      
        ">
Xóa liên hệ
</div>
        `);
                        // take original of li
                        let userInfoHTML = userInfo.get(0).outerHTML;
                        $("#contacts").find("ul").prepend(userInfoHTML);
                        $(userInfo).remove();

                        decreaseNumberNotifiContact("count-request-contact-received");
                        increaseNumberNotifiContact("count-contacts");
                        decreaseNumberNotification("noti_contact_counter", 1);

                        socket.emit("approve-request-contact-received", {
                            contactId: targetId,
                        });
                    }
                },
            });
        });
}

socket.on("response-approve-request-contact-received", function(user) {
    let notif = `<div class="notif-readed-false" data-uid="${user.id}">
    <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
    <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn!
</div>`;
    // prepend ngược với append
    $(".noti_content").prepend(notif);
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);
    decreaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);

    decreaseNumberNotifiContact("count-request-contact-sent");
    increaseNumberNotifiContact("count-contacts");
    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
    let userInfo = `
    %>
    <li class="_contactList" data-uid="${item._id}
                                                        
                                                        ">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${item.avatar}
                                                                  
                                                                " alt="">
            </div>
            <div class="user-name">
                <p>
                  
                                                                        ${item.username}
                                                                     
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>
                                                                            ${item.address}
                                                                        
                                                                        </span>
            </div>
            <div class="user-talk" data-uid="
                                                                        ${item._id}
                                                                   
                                                                        ">
                Trò chuyện
            </div>
            <div class="user-remove-contact
                                                                        action-danger" data-uid="
                                                                        ${item._id}
                                                                 
                                                                        ">
                Xóa liên hệ
            </div>
        </div>
    </li>
    `;
    $("#contacts").find("ul").prepend(userInfoHTML);
});

$(document).ready(function() {
    approveRequestContactReceived();
});