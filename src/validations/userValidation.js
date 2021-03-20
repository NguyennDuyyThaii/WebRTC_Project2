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

module.exports = {
    updateInfo: updateInfo
}