const messageValidation = require("./messageValidation")
const contactValidate = require("./contactValidate")
const groupChatValidation = require("./groupChatValidation")
const userValidation = require("./userValidation")
module.exports = {
    messageValidation: messageValidation,
    contactValidate: contactValidate,
    groupChatValidation: groupChatValidation,
    userValidation: userValidation
}