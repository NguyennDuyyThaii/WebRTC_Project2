function decreaseNumberNotifiContact(className) {
    let currentValue = +$(`.${className}`).find("em").text();
    currentValue -= 1;

    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${currentValue}</em>)`);
    }
}

function removeContact() {
    $(".user-remove-contact")
        .unbind("click")
        .on("click", function() {
            let targetId = $(this).data("uid");
            let username = $(this).parent().find("div.user-name p").text();
            Swal.fire({
                title: `Bạn có chắc muốn xoá ${username} khỏi danh bạ?`,
                text: "Bạn không thể hoàn tác được quá trình này",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2ECC71",
                cancelButtonColor: "#ff7675",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Huỷ",
            }).then((result) => {
                if (!result.value) {
                    return false;
                }
                $.ajax({
                    url: "/contact/user-remove-contact",
                    type: "delete",
                    data: { uid: targetId },
                    success: function(data) {
                        if (data.success) {
                            $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                            decreaseNumberNotifiContact("count-contacts");

                            socket.emit("user-remove-contact", {
                                contactId: targetId,
                            });
                        }
                    },
                });
            });
        });
}

socket.on("response-user-remove-contact", function(user) {
    $("#contacts").find(`ul li[data-uid =${user.id}]`).remove();
    decreaseNumberNotifiContact("count-contacts");
});

$(document).ready(function() {
    removeContact();
});