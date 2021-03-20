let userAvatar = null
let userInfo = {}
let originAvatarSrc = null

function updateUserInfo() {
    // avatar
    $("#input-change-avatar").bind("change", function() {
            let fileData = $(this).prop("files")[0]
            let math = ["image/png", "image/jpeg", "image/jpg"]
            let limit = 1048576

            if ($.inArray(fileData.type, math) === -1) {
                alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận định dạng jpg,png,jpeg", "error", 7)
                return false
            }
            if (fileData.size > limit) {
                alertify.notify("Ảnh upload không được quá 1 MB", "error", 7)
                return false
            }
            if (typeof(FileReader) != "undefined") {
                let imagePreview = $("#image-edit-profile")
                imagePreview.empty()


                let fileReader = new FileReader()
                fileReader.onload = function(e) {
                    $("<img>", {
                        "src": e.target.result,
                        "class": "avatar img-circle",
                        "id": "user-modal-avatar",
                        "alt": "avatar"
                    }).appendTo(imagePreview)
                }
                imagePreview.show()
                fileReader.readAsDataURL(fileData)
                    // Hoàn thành bước hiển thị ảnh khi thay

                // bước tiếp theo
                let formData = new FormData()
                formData.append("avatar", fileData) // avatar la name input change image

                userAvatar = formData
            } else {
                alertify.notify("Trình duyệt của bạn không hỗ trợ fileReader", "error", 7)
                return false
            }
        })
        // username
    $("#input-change-username").bind("change", function() {
            userInfo.username = $(this).val()
        })
        // address
    $("#input-change-address").bind("change", function() {
            userInfo.address = $(this).val()
        })
        // gender
    $("#input-change-gender-male").bind("click", function() {
        userInfo.gender = $(this).val()
    })
    $("#input-change-gender-female").bind("click", function() {
        userInfo.gender = $(this).val()
    })
}
$(document).ready(function() {
    updateUserInfo()
        // lấy cái src của ảnh gốc
    originAvatarSrc = $("#user-modal-avatar").attr("src")
        //btn-save)
    $("#btn-update-user").bind("click", function() {
            if ($.isEmptyObject(userInfo) && !userAvatar) {
                alertify.notify("Bạn phải thay đổi trước khi cập nhập dữ liệu!", "error", 7)
                return false
            }
            $.ajax({
                url: '/user/update-avatar',
                type: 'put',
                // muốn truyền cái formData thì cần false 3 cái này
                cache: false,
                contentType: false,
                processData: false,
                data: userAvatar,
                success: function() {

                },
                error: function() {

                }
            })
        })
        //btn-rest
    $("#btn-cancel-user").bind("click", function() {
        userAvatar = null
        userInfo = {}
            // khi reset thì phải trả về cái ảnh gốc
        $("#user-modal-avatar").attr("src", originAvatarSrc)
    })
})