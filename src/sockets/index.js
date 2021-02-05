const addNewContact = require("./contact/addNewContact")
const removeRequestContactSent = require("./contact/removeRequestContact")
const removeRequestContactReceived = require('./contact/removeRequestContactReceived')
const approveRequestContactReceived = require('./contact/approveRequestContact')
const removeContact = require('./contact/removeContact')
let initSockets = (io) => {
    addNewContact(io)
    removeRequestContactSent(io)
    removeRequestContactReceived(io)
    approveRequestContactReceived(io)
    removeContact(io)
}
module.exports = initSockets