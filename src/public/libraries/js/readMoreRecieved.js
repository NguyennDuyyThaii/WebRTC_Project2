$(document).ready(function() {
    $("#link-read-more-contacts-received").bind("click", function() {
        let skipNumber = $("#request-contact-received").find("li").length
            // cach 2 ne
        $("#link-read-more-contacts-received").css("display")
        $.get(`/contacts/read-more-received?skipNumber=${skipNumber}`, function(contacts) {
            if (!contacts.length) {
                alertify.notify("Bạn không còn danh sách nào cả", "error", 7)
                return false
            }
            // 
            contacts.forEach(function(item) {
                $("#request-contact-received").find("ul").append(
                    `
                    <li class="_contactList" data-uid="
                                                                                                                        ${item._id}
                                                                                                                     ">
                                        <div class="contactPanel">
                                            <div class="user-avatar">
                                                <img src="images/users/
                                                                                                                                    ${item.avatar}
                                                                                                                                   
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
                                                                                                                                            ${(item.address !== null) ? item.address : ""}
                                                                                                                                        
                                                                                                                                        </span>
                                            </div>
                                            <div class="user-approve-request-contact-received" data-uid="
                                                                                                                                        ${item._id}
                                                                                                                                       ">
                                                Chấp nhận
                                            </div>
                                            <div class="user-reject-request-contact-received
                                                                                                                                        action-danger" data-uid="
                                                                                                                                        ${item._id}
                                                                                                                                    ">
                                                Xóa yêu cầu
                                            </div>
                                        </div>
                                    </li>
                `)
            })
            approveRequestContactReceived()
            removeRequestContactReceived()
        })
    })
})