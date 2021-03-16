const { check } = require("express-validator")


let addNewGroup = [
    check("arrayIds", "Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu là 3 người trở lên tính cả bạn!")
    // neu kieu du lieu truyen len ma khong co vd length-empty thi su dung custom nha
    .custom((value) => {
        if (!Array.isArray(value)) {
            return false
        }
        if (value.length < 2) {
            return false
        }
        return true
    }),
    check("groupChatName", "Vui lòng nhập tên cuộc trò chuyến, giới hạn 5 đến 30 kí tự và không chứa các kí tự đặc biệt!")
    .isLength({ min: 5, max: 30 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
]

module.exports = {
    addNewGroup: addNewGroup
}