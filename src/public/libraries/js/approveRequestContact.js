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
    $(".user-approve-request-contact-received").bind("click", function() {
        let targetId = $(this).data("uid");
        // $(this).parent() => de di ra ngoai sau do huong vao
        let targetName = $(this).parent().find("div.user-name>p").text().trim();
        let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

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
                            <div class="user-talk" data-uid="${targetId}">
                                                Trò chuyện </div>
<div class="user-remove-contact action-danger" data-uid="${targetId}">
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

                    removeContact();

                    socket.emit("approve-request-contact-received", {
                        contactId: targetId,
                    });

                    // All steps handle chat after approve contact

                    // step01: hide modal
                    $("#contactsModal").modal("hide");
                    // step02: handle leftSide.ejs
                    let subUsername = targetName;
                    if (subUsername.length > 15) {
                        subUsername = subUsername.substr(0, 14);
                    }
                    let leftSideData = `
                    <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                                <li class="person" data-chat="${targetId}">
                                    <div class="left-avatar">
                                        <div class="dot"></div>
                                        <img src="${targetAvatar}" alt="">
                                    </div>
                                    <span class="name">
                                        ${subUsername}
                                                                </span>
                                                                <span class="time">
                                                                   
                                                                </span>
                                                                <br>
                                                                <span class="preview">
                                                                </span>
                                </li>
                                </a>
                    `;

                    $("#all-chat").find("ul").prepend(leftSideData);
                    $("#user-chat").find("ul").prepend(leftSideData);
                    // step03: handle rightSide
                    let rightSideData = `
                    <div class="right tab-pane" data-chat="${targetId}" id="to_${targetId}">
                    <div class="top">
                        <span>To: <span class="name">${targetName}</span> </span></span>
                        <span class="chat-menu-right">
                            <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                                Tệp đính kèm
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                                Hình ảnh
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${targetId}">
                        </div>
                    </div>
                    <div class="write" data-chat="${targetId}">
                        <input type="text" class="write-chat" id="write-chat-${targetId}" data-chat="${targetId}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${targetId}">
                                <input type="file" id="image-chat-${targetId}" name="my-image-chat" class="image-chat" data-chat="${targetId}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attachment-chat-${targetId}">
                                <input type="file" id="attachment-chat-${targetId}" name="my-attachment-chat" class="attachment-chat" data-chat="${targetId}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javascript:void(0)" id="video-chat-${targetId}" class="video-chat" data-chat="${targetId}">
                                <i class="fa fa-video-camera"></i>
                            </a>

                        </div>
                    </div>
                </div>
                        `
                    $("#screen-chat").prepend(rightSideData)
                        //step04: call function changeScreenChat
                    changeScreenChat()
                        //step05: handle image modal
                    let imageModalData = `
                           <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
                           <div class="modal-dialog modal-lg">
                               <div class="modal-content">
                           <div class="modal-header">
                               <button type="button" class="close" data-dismiss="modal">&times;</button>
                               <h4 class="modal-title">Toàn bộ hình ảnh của cuộc trò chuyện
       
                               </h4>
                           </div>
                           <div class="modal-body">
                               <div class="all-images" style="visibility: hidden;">
                               </div>
                           </div>
                           `
                    $("body").append(imageModalData) // vì khai báo ở index.ejs
                        //step06: call function gridPhoto
                    gridPhotos(5)
                        //step07: handle attachment modal
                    let attachmentModal = `
                           <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
                           <div class="modal-dialog modal-lg">
                               <div class="modal-content">
                                   <div class="modal-header">
                                       <button type="button" class="close" data-dismiss="modal">&times;</button>
                                       <h4 class="modal-title">Toàn bộ file đính kèm của cuộc trò chuyện</h4>
                                   </div>
                                   <div class="modal-body">
                                       <ul class="list-attachments">
                                       </ul>
                                   </div>
                               </div>
                           </div>
                       </div>
                           `
                    $("body").append(attachmentModal); // vì khai báo ở index.ejs
                    //step8: update online
                    socket.emit("check-status")
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
        <li class="_contactList" data-uid="${user.id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${user.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                    
                    ${user.username}
                                                                        
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>
                    ${user.address}
                    </span>
                </div>
                <div class="user-talk" data-uid="${user.id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user.id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
        `;
    $("#contacts").find("ul").prepend(userInfo);
    removeContact();


    // step01: hide modal
    // step02: handle leftSide.ejs
    let subUsername = user.username;
    if (subUsername.length > 15) {
        subUsername = subUsername.substr(0, 14);
    }
    let leftSideData = `
                    <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
                                <li class="person" data-chat="${user.id}">
                                    <div class="left-avatar">
                                        <div class="dot"></div>
                                        <img src="images/users/${user.avatar}" alt="">
                                    </div>
                                    <span class="name">
                                        ${subUsername}
                                                                </span>
                                                                <span class="time">
                                                                   
                                                                </span>
                                                                <br>
                                                                <span class="preview">
                                                                </span>
                                </li>
                                </a>
                    `;

    $("#all-chat").find("ul").prepend(leftSideData);
    $("#user-chat").find("ul").prepend(leftSideData);
    // step03: handle rightSide
    let rightSideData = `
                    <div class="right tab-pane" data-chat="${user.id}" id="to_${user.id}">
                    <div class="top">
                        <span>To: <span class="name">${user.username}</span> </span></span>
                        <span class="chat-menu-right">
                            <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                                Tệp đính kèm
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                                Hình ảnh
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${user.id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${user.id}">
                        <input type="text" class="write-chat" id="write-chat-${user.id}" data-chat="${user.id}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${user.id}">
                                <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat" data-chat="${user.id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attachment-chat-${user.id}">
                                <input type="file" id="attachment-chat-${user.id}" name="my-attachment-chat" class="attachment-chat" data-chat="${user.id}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat" data-chat="${user.id}">
                                <i class="fa fa-video-camera"></i>
                            </a>

                        </div>
                    </div>
                </div>
                        `
    $("#screen-chat").prepend(rightSideData)
        //step04: call function changeScreenChat
    changeScreenChat()
        //step05: handle image modal
    let imageModalData = `
                           <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
                           <div class="modal-dialog modal-lg">
                               <div class="modal-content">
                           <div class="modal-header">
                               <button type="button" class="close" data-dismiss="modal">&times;</button>
                               <h4 class="modal-title">Toàn bộ hình ảnh của cuộc trò chuyện
       
                               </h4>
                           </div>
                           <div class="modal-body">
                               <div class="all-images" style="visibility: hidden;">
                               </div>
                           </div>
                           `
    $("body").append(imageModalData) // vì khai báo ở index.ejs
        //step06: call function gridPhoto
    gridPhotos(5)
        //step07: handle attachment modal
    let attachmentModal = `
                           <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
                           <div class="modal-dialog modal-lg">
                               <div class="modal-content">
                                   <div class="modal-header">
                                       <button type="button" class="close" data-dismiss="modal">&times;</button>
                                       <h4 class="modal-title">Toàn bộ file đính kèm của cuộc trò chuyện</h4>
                                   </div>
                                   <div class="modal-body">
                                       <ul class="list-attachments">
                                       </ul>
                                   </div>
                               </div>
                           </div>
                       </div>
                           `
    $("body").append(attachmentModal); // vì khai báo ở index.ejs
    //step8: update online
    socket.emit("check-status")
});

$(document).ready(function() {
    approveRequestContactReceived();
});