const { check } = require("express-validator")


let checkMessageLength = [
    check("messageVal", "Tin nhắn không hợp lệ, tin nhắn tối thiểu là 1 từ, tối đa là 400 từ.")
    .isLength({ min: 1, max: 400 })
]

module.exports = {
    checkMessageLength: checkMessageLength
}