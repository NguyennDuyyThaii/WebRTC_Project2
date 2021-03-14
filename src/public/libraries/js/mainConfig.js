/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
const socket = io()

function nineScrollLeft() {
    $('.left').niceScroll({
        smoothscroll: true,
        horizrailenabled: false,
        cursorcolor: '#ECECEC',
        cursorwidth: '7px',
        scrollspeed: 50
    });
}

function nineScrollRight(divId) {
    $(`.right .chat[data-chat = ${divId}]`).niceScroll({
        smoothscroll: true,
        horizrailenabled: false,
        cursorcolor: '#ECECEC',
        cursorwidth: '7px',
        scrollspeed: 50
    });
    $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
    $(`#write-chat-${divId}`).emojioneArea({
        standalone: false,
        pickerPosition: 'top',
        filtersPosition: 'bottom',
        tones: false,
        autocomplete: false,
        inline: true,
        hidePickerOnBlur: true,
        search: false,
        shortnames: false,
        events: {
            keyup: function(editor, event) {
                $(`#write-chat-${divId}`).val(this.getText());
            },
            click: function() {
                textAndEmojiChat(divId)
                typingOn(divId)
            },
            blur: function() {
                typingOff(divId)
            }
        },
    });
    $('.icon-chat').bind('click', function(event) {
        event.preventDefault();
        $('.emojionearea-button').click();
        $('.emojionearea-editor').focus();
    });
}

function spinLoaded() {
    $('#loader').css('display', 'none');
}

function spinLoading() {
    $('#loader').css('display', 'block');
}

function ajaxLoading() {
    $(document)
        .ajaxStart(function() {
            spinLoading();
        })
        .ajaxStop(function() {
            spinLoaded();
        });
}

function showModalContacts() {
    $('#show-modal-contacts').click(function() {
        $(this).find('.noti_contact_counter').fadeOut('slow');
    });
}

function configNotification() {
    $('#noti_Button').click(function() {
        $('#notifications').fadeToggle('fast', 'linear');
        $('.noti_counter').fadeOut('slow');
        return false;
    });
    $(".main-content").click(function() {
        $('#notifications').fadeOut('fast', 'linear');
    });
}

function gridPhotos(layoutNumber) {
    $(".show-images").unbind("click").on("click", function() {
        let href = $(this).attr("href");
        let modalImages = href.replace("#", "")

        let originDataImage = $(`#${modalImages}`).find('div.modal-body').html()

        let countRows = Math.ceil($(`#${modalImages}`).find('div.all-images>img').length / layoutNumber);
        let layoutStr = new Array(countRows).fill(layoutNumber).join("");
        $(`#${modalImages}`).find('div.all-images').photosetGrid({
            highresLinks: true,
            rel: 'withhearts-gallery',
            gutter: '2px',
            layout: layoutStr,
            onComplete: function() {
                $(`#${modalImages}`).find('.all-images').css({
                    'visibility': 'visible'
                });
                $(`#${modalImages}`).find('.all-images a').colorbox({
                    photo: true,
                    scalePhotos: true,
                    maxHeight: '90%',
                    maxWidth: '90%'
                });
            }
        });
        // bat su kien dong modal 
        $(`#${modalImages}`).on('hidden.bs.modal', function() {
            $(this).find("div.modal-body").html(originDataImage)
        })

    })

}

// function showButtonGroupChat() {
//     $('#select-type-chat').bind('change', function() {
//         if ($(this).val() === 'group-chat') {
//             $('.create-group-chat').show();
//             // Do something...
//         } else {
//             $('.create-group-chat').hide();
//         }
//     });
// }


function changeTypeChat() {
    $("#select-type-chat").bind("change", function() {
        let optionSelected = $("option:selected", this)
        optionSelected.tab("show")

        if ($(this).val() === "user-chat") {
            $(".create-group-chat").hide()
        } else {
            $(".create-group-chat").show()
        }
    })
}

function changeScreenChat() {
    $(".room-chat").unbind("click").on("click", function() {
        let divId = $(this).find("li").data("chat")
        $(".person").removeClass("active")
            // $(".person").addClass("active")
        $(`.person[data-chat=${divId}]`).addClass("active")
        $(this).tab("show")

        nineScrollRight(divId);

        enableEmojioneArea(divId);

        imageChat(divId);

        attachmentChat(divId);

        videoChat(divId)
    })
}
$(document).ready(function() {
    // Hide số thông báo trên đầu icon mở modal contact
    showModalContacts();

    // Bật tắt popup notification
    configNotification();

    // Cấu hình thanh cuộn
    nineScrollLeft();


    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn


    // Icon loading khi chạy ajax
    ajaxLoading();

    // Hiển thị button mở modal tạo nhóm trò chuyện
    //showButtonGroupChat();

    // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
    // Tham số chỉ được phép trong khoảng từ 1 đến 5
    gridPhotos(5);



    // thay doi kieu tro chuyen
    changeTypeChat();
    // thay doi man hinh chat 
    changeScreenChat()
        // click vao phan tu tro chuyen dau tien khi load trang
    $("ul.people").find("a")[0].click()

    $("#video-chat-group").bind('click', function() {
        alertify.notify("Không khả dụng với nhóm trò chuyện, tính năng này chúng tôi đang khắc phục", "error", 7)
    })
});