$(document).ready(function() {
    $("#link-read-more-contacts").bind("click", function() {
        let skipNumber = $("#contacts").find("li").length
            // cach 2 ne
        $("#link-read-more-contacts").css("display")
        $.get(`/contacts/read-more?skipNumber=${skipNumber}`, function(contacts) {
            if (!contacts.length) {
                alertify.notify("Bạn không còn bạn bè nào cả", "error", 7)
                return false
            }
            // 
            contacts.forEach(function(item) {
                $("#contacts").find("ul").append(`
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
                            <span>&nbsp ${(item.address !== null) ? item.address : ""} 
                                                                                    </span>
                        </div>
                        <div class="user-talk" data-uid="${item._id}
                                                                                    ">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact
                                                                                    action-danger" data-uid="${item._id}
                                                                                    ">
                            Xóa liên hệ
                        </div>
                    </div>
                </li>
                `)
            })
            removeContact();
        })
    })
})