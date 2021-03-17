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
        .bind("click", function() {
            let targetId = $(this).data("uid");
            let username = $(this).parent().find("div.user-name>p").text();
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

                            // all step handel chat remove contact
                            // step0: check active
                            let checkActive = $("#all-chat").find(`li[data-chat=${targetId}]`).hasClass("active");
                            // step01: remove leftSide
                            $("#all-chat").find(`ul a[href= "#uid_${targetId}"]`).remove();
                            $("#user-chat").find(`ul a[href= "#uid_${targetId}"]`).remove();

                            // step02: remove rightSide
                            $("#screen-chat").find(`div#to_${targetId}`).remove();
                            // step03: remove imageModal
                            $("body").find(`div#imagesModal_${targetId}`).remove();
                            // step04: remove attachmentModal
                            $("body").find(`div#attachmentsModal_${targetId}`).remove();
                            // step05: click first conversation
                            if (checkActive) {
                                $("ul.people").find("a")[0].click();
                            }
                        }
                    },
                });
            });
        });
}

socket.on("response-user-remove-contact", function(user) {
    $("#contacts").find(`ul li[data-uid =${user.id}]`).remove();
    decreaseNumberNotifiContact("count-contacts");
    // all step handel chat remove contact
    // step0: check active
    let checkActive = $("#all-chat").find(`li[data-chat=${user.id}]`).hasClass("active");
    // step01: remove leftSide
    $("#all-chat").find(`ul a[href="#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href="#uid_${user.id}"]`).remove();

    // step02: remove rightSide
    $("#screen-chat").find(`div#to_${user.id}`).remove();
    // step03: remove imageModal
    $("body").find(`div#imagesModal_${user.id}`).remove();
    // step04: remove attachmentModal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();
    // step05: click first conversation
    if (checkActive) {
        $("ul.people").find("a")[0].click()
    }
});

$(document).ready(function() {
    removeContact();
});