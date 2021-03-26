let userAvatar = null
let userInfo = {}
let originAvatarSrc = null
let originUserInfo = {}
let userUpdatePassword = {}

function callLogout() {
    let timerInterval
    Swal.fire({
        position: 'top-end',
        title: 'Tự động đăng xuất sau 5 giây',
        html: "Thời gian: <strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        $.get("/logout", function() {
            // reload lai trang
            location.reload();
        })
    })
}

function updateUserInfo() {
    // avatar
    $("#input-change-avatar").bind("change", function() {
            let fileData = $(this).prop("files")[0]
            let math = ["image/png", "image/jpeg", "image/jpg"]
            let limit = 1048576

            if ($.inArray(fileData.type, math) === -1) {
                alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận định dạng jpg, png, jpeg", "error", 7)
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
            let username = $(this).val()
            let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
            if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
                alertify.notify("Username giới hạn trong khoảng 3 đến 17 kí tự và không chứa các kí tự đặc biệt", "error", 7)
                $(this).val(originUserInfo.username)
                delete userInfo.username
                return false
            }
            userInfo.username = $(this).val()
        })
        // address
    $("#input-change-address").bind("change", function() {
            let address = $(this).val()

            if (address.length < 3 || address.length > 30) {
                alertify.notify("Không được để trống địa chỉ, địa chỉ giới hạn trong khoảng 3 đến 30 kí tự!", "error", 7)
                $(this).val(originUserInfo.address)
                delete userInfo.address
                return false
            }
            userInfo.address = address
        })
        // gender
    $("#input-change-gender-male").bind("click", function() {
        let gender = $(this).val()
        if (gender !== "male") {
            alertify.notify("Oh có vấn đề gì đó liên quan đến giới tính, trình duyệt bạn có vấn đề? Hãy kiểm tra lại!", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender
    })
    $("#input-change-gender-female").bind("click", function() {
        let gender = $(this).val()
        if (gender !== "female") {
            alertify.notify("Oh có vấn đề gì đó liên quan đến giới tính, trình duyệt bạn có vấn đề? Hãy kiểm tra lại!", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender
    })

    // password change
    $("#input-change-current-password").bind("change", function() {
        let currentPassword = $(this).val()
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if (!regexPassword.test(currentPassword)) {
            alertify.notify("Mật khẩu phải có 8 kí tự, bao gồm chữ hoa chứ thường, kí tự đặc biệt và số!", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.currentPassword
            return false
        }
        userUpdatePassword.currentPassword = currentPassword
    })
    $("#input-change-new-password").bind("change", function() {
        let newPassword = $(this).val()
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if (!regexPassword.test(newPassword)) {
            alertify.notify("Mật khẩu phải có 8 kí tự, bao gồm chữ hoa chứ thường, kí tự đặc biệt và số!", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.newPassword
            return false
        }
        userUpdatePassword.newPassword = newPassword
    })
    $("#input-change-confirm-new-password").bind("change", function() {
        let confirmPassword = $(this).val()
        if (!userUpdatePassword.newPassword) {
            alertify.notify("Bạn chưa nhập mật khẩu mới, hãy nhập trước khi làm bước này!", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.confirmPassword
            return false
        }
        if (confirmPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Nhập lại mật khẩu chưa chính xác, kiểm tra lại!", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.confirmPassword
            return false
        }

        userUpdatePassword.confirmPassword = confirmPassword
    })


}

function callUpdateUserAvatar() {
    $.ajax({
        url: '/user/update-avatar',
        type: 'put',
        // muốn truyền cái formData thì cần false 3 cái này
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(data) {
            // display success
            $(".user-modal-alert-success").find("span").text(data.message)
            $(".user-modal-alert-success").css("display", "block")
                // update user at navbar
            $("#navbar-avatar").attr("src", data.imgSrc)
                // update origin avatar src
            originAvatarSrc = data.imgSrc
                // reset all
            $("#btn-cancel-user").click()
        },
        error: function(error) {
            // display error
            // console.log(error) de thay dc cai responseText
            $(".user-modal-alert-error").find("span").text(error.responseText)
            $(".user-modal-alert-error").css("display", "block")

            // reset all
            $("#btn-cancel-user").click()
        }
    })
}

function callUpdateUserInfo() {
    $.ajax({
        url: '/user/update-info',
        type: 'put',
        // muốn truyền cái formData thì cần false 3 cái này
        data: userInfo,
        success: function(data) {
            // display success
            $(".user-modal-alert-success").find("span").text(data.message)
            $(".user-modal-alert-success").css("display", "block")
                // update origin user info
                // Object.assign() được sử dụng để sao chép các giá trị của tất
                //  cả thuộc tính có thể liệt kê từ một hoặc nhiều đối tượng nguồn 
                //  đến một đối tượng đích. Nó sẽ trả về đối tượng đích đó.
            originUserInfo = Object.assign(originUserInfo, userInfo)
                // update name navbar
            $("#navbar-username").text(originUserInfo.username)
                // reset all
            $("#btn-cancel-user").click()
        },
        error: function(error) {
            // display error
            // console.log(error) de thay dc cai responseText
            $(".user-modal-alert-error").find("span").text(error.responseText)
            $(".user-modal-alert-error").css("display", "block")

            // reset all
            $("#btn-cancel-user").click()
        }
    })
}

function callUpdateUserPassword() {
    $.ajax({
        url: '/user/update-password',
        type: 'put',
        // muốn truyền cái formData thì cần false 3 cái này
        data: userUpdatePassword,
        success: function(data) {
            // display success
            $(".user-modal-password-alert-success").find("span").text(data.message)
            $(".user-modal-password-alert-success").css("display", "block")
                // update origin user info
                // Object.assign() được sử dụng để sao chép các giá trị của tất
                //  cả thuộc tính có thể liệt kê từ một hoặc nhiều đối tượng nguồn 
                //  đến một đối tượng đích. Nó sẽ trả về đối tượng đích đó.
                // originUserInfo = Object.assign(originUserInfo, userInfo)
                //     // update name navbar
                // $("#navbar-username").text(originUserInfo.username)
                // reset all
            $("#input-btn-cancel-user-password").click()

            // logout after change password success
            callLogout()
        },
        error: function(error) {
            // display error
            // console.log(error) de thay dc cai responseText
            $(".user-modal-password-alert-error").find("span").text(error.responseText)
            $(".user-modal-password-alert-error").css("display", "block")

            // reset all
            $("#input-btn-cancel-user-password").click()
        }
    })
}
$(document).ready(function() {
    updateUserInfo()
        // lấy cái src của ảnh gốc
    originAvatarSrc = $("#user-modal-avatar").attr("src")

    // originUserInfo
    originUserInfo = {
            username: $("#input-change-username").val(),
            address: $("#input-change-address").val(),
            gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val()
        }
        //btn-save)
    $("#btn-update-user").bind("click", function() {
            if ($.isEmptyObject(userInfo) && !userAvatar) {
                alertify.notify("Bạn phải thay đổi trước khi cập nhập dữ liệu!", "error", 7)
                return false
            }
            if (userAvatar) {
                callUpdateUserAvatar()
            }
            if (!$.isEmptyObject(userInfo)) {
                callUpdateUserInfo()
            }
        })
        //btn-rest
    $("#btn-cancel-user").bind("click", function() {
        userAvatar = null
        userInfo = {}
            // khi reset thì phải trả về cái ảnh gốc
        $("#user-modal-avatar").attr("src", originAvatarSrc)

        $("#input-change-username").val(originUserInfo.username);
        (originUserInfo.gender === "male") ? $("#input-change-gender-male").click(): $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address)


    })

    // update password

    $("#input-btn-update-user-password").bind("click", function() {
        if (!userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword || !userUpdatePassword.currentPassword) {
            alertify.notify("Bạn phải thay đổi tất cả thông tin trước khi cập nhập!", "error", 7)
            return false
        }
        Swal.fire({
            title: 'Bạn có chắc muốn thay đổi lại mật khẩu?',
            text: "Bạn không thể hoàn lại thao tác này!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ'
        }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancel-user-password").click()
                return false;
            }
            callUpdateUserPassword()
        })

    })
    $("#input-btn-cancel-user-password").bind("click", function() {
        userUpdatePassword = {}
        $("#input-change-current-password").val(null)
        $("#input-change-new-password").val(null)
        $("#input-change-confirm-new-password").val(null)
    })
})