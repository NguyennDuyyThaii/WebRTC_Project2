const addNewContact = require("./contact/addNewContact")

let initSockets = (io) => {
    addNewContact(io)
}
module.exports = initSockets