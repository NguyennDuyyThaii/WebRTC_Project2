const addNewContact = require("./contact/addNewContact")
const removeRequestContact = require("./contact/removeRequestContact")
let initSockets = (io) => {
    addNewContact(io)
    removeRequestContact(io)
}
module.exports = initSockets