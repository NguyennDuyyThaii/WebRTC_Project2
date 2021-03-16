let transRegister = {
    email_incorect: "Email phải có định dạng example@gmail.com",
    email_not_empty: "Email không được để trống",
    password_incorect: "Mật khẩu phải có ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường",
    password_not_empty: "Mật khẩu không được để trống",
    re_password_incorect: "Nhập lại mật khẩu chưa chính xác, bạn hãy nhập lại",
    gender_incorect: "Giới tính chưa được tích, hãy kiểm tra lại",
    email_in_use: "Email này đã tồn tại trong một tài khoản khác !",
    account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống của chúng tôi",
    account_not_active: "Tài khoản này đã được đăng kí nhưng chưa được ACTIVE, kiểm tra email của bạn",
    userCreated: (useremail) => {
        return `Tài khoản <strong>${useremail}</strong> đã đăng kí nhưng chưa kích hoạt, hãy kiểm tra Email bạn đã đăng kí  `
    }
}

let Registermailer = {
    subject: "NguyenDuyThai: Xác nhận thông tin tài khoản của bạn !",
    template: (linkVerify) => {
        return `
            <h2>Bạn nhận được Email này vì muốn đăng kí tài khoản với hệ thống của chúng tôi.</h2>
            <h3>Vui lòng Click vào liên kết bên dưới để kích hoạt tài khoản:</h3>
            <h3><a href="${linkVerify}" target="blank" >${linkVerify}</a></h3>
            <h1>Xin chân thành cảm ơn!</h1>
        `
    },
    send_faild: "Có lối trong quá trình gửi email, vui lòng xem lại tất cả các thông tin!",
    account_actived: "Kích hoạt tài khoản thành công, Bạn có thể đăng nhập",
    logout_success: "Đăng xuất tài khoản thành công!"
}

const transPassport = {
    server_error: "Có lỗi ở phía Server, Vui lòng đăng nhập hoặc trở lại sau, cảm ơn.",
    login_failed: "Tài khoản hoặc mật khẩu không chính xác, hãy kiểm tra lại!",
    account_not_active: "Tài khoản này đã được đăng kí nhưng chưa được ACTIVE, kiểm tra email của bạn",
    login_success: (username) => {
        return `Xin chào <strong>${username}</strong>, Chúc bạn một ngày tốt lành!`
    }
}
module.exports = {
    transRegister: transRegister,
    Registermailer: Registermailer,
    transPassport: transPassport
}