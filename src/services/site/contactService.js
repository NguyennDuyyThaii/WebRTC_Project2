const contactModel = require("../../models/contactModel")
const userModel = require("../../models/userModel")
const _ = require("lodash")
let findUserContact = (currentUserId, keyword) => {
    return new Promise(async(resolve, reject) => {
        /**
         * deprecated id that dont use
         */
        let deprecatedUserId = [currentUserId]
        let contactByUser = await contactModel.findAllByUser(currentUserId)
        contactByUser.forEach((contact) => {
            deprecatedUserId.push(contact.userId)
            deprecatedUserId.push(contact.contactId)
        })
        deprecatedUserId = _.uniqBy(deprecatedUserId)
        let users = await userModel.findAllForAddContact(deprecatedUserId, keyword)
        resolve(users)
    })
}

let addNew = (currentUserId, contactId) => {
    return new Promise(async(resolve, reject) => {
        let contactExists = await contactModel.checkExists(currentUserId, contactId)
        if (contactExists) {
            return reject(false)
        }
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        }

        let newContact = await contactModel.createNew(newContactItem)
        resolve(newContact)
    })
}
let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async(resolve, reject) => {
        await contactModel.removeRequestContact(currentUserId, contactId)
        resolve(true)
    })
}
module.exports = {
    findUserContact: findUserContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact
}