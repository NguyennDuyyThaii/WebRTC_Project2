$(document).ready(function() {
    $("#link-read-more-contacts-sent").bind("click", function() {
        let skipNumber = $("#request-contact-sent").find("li").length
            // cach 2 ne
        $("#link-read-more-contacts-sent").css("display", "none")
        $.get(`/contacts/read-more-sent?skipNumber=${skipNumber}`, function(contacts) {
            if (!contacts.length) {
                alertify.notify("Bạn không còn danh sách nào cả", "error", 7)
                $("#link-read-more-contacts-sent").css("display", "inline-block")
                return false
            }
            // 
            contacts.forEach(function(item) {
                $("#request-contact-sent").find("ul").append(
                    `
                    <li class="_contactList" data-uid="${item._id}">
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
                                                                                                   ${(item.address !== null) ? item.address : "" }
                                                                                                      
                                                                                                    </span>
                        </div>
                        <div class="user-remove-request-contact-sent display-importaint
                                                                                                    action-danger" data-uid="${item._id}">
                            Hủy yêu cầu
                        </div>
                    </div>
                </li>
                `)
            })
            removeRequestContactSent()
            $("#link-read-more-contacts-sent").css("display", "inline-block")
        })
    })
})