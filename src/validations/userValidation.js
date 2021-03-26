const { transUpdateUser } = require("./../../lang/vi")
const { check } = require("express-validator")
let updateInfo = [
    check("username", transUpdateUser.username)
    .optional()
    .isLength({ min: 3, max: 17 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),

    check("address", transUpdateUser.address)
    .optional()
    .isLength({ min: 3, max: 30 }),

    check("gender", transUpdateUser.gender)
    .optional()
    .isIn(["male", "female"])
]

let updatePassword = [
    check("currentPassword", transUpdateUser.current_password)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPassword", transUpdateUser.current_password)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("confirmPassword", transUpdateUser.confirmPassword)
    .custom((value, { req }) => {
        return value === req.body.newPassword
    })

]
module.exports = {
    updateInfo: updateInfo,
    updatePassword: updatePassword
}