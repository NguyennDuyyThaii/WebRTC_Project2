const addNewContact = require("./contact/addNewContact")
const removeRequestContactSent = require("./contact/removeRequestContact")
const removeRequestContactReceived = require('./contact/removeRequestContactReceived')
const approveRequestContactReceived = require('./contact/approveRequestContact')
const removeContact = require('./contact/removeContact')
const chatTextEmoji = require('./chat/chatTextEmoji')
const typingOn = require('./chat/typingOn');
const typingOff = require('./chat/typingOff')
let initSockets = (io) => {
    addNewContact(io)
    removeRequestContactSent(io)
    removeRequestContactReceived(io)
    approveRequestContactReceived(io)
    removeContact(io)
    chatTextEmoji(io)
    typingOn(io)
    typingOff(io)
}
module.exports = initSockets