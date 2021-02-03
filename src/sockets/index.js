const addNewContact = require("./contact/addNewContact")
const removeRequestContactSent = require("./contact/removeRequestContact")
let initSockets = (io) => {
    addNewContact(io)
    removeRequestContactSent(io)
}
module.exports = initSockets