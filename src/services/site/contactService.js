const contactModel = require("../../models/contactModel");
const userModel = require("../../models/userModel");
const notificationModel = require("../../models/notificationModels");
const _ = require("lodash");
const LIMIT_NUMBER_TAKEN = 10;
let findUserContact = (currentUserId, keyword) => {
    return new Promise(async(resolve, reject) => {
        /**
         * deprecated id that dont use
         */
        let deprecatedUserId = [currentUserId];
        let contactByUser = await contactModel.findAllByUser(currentUserId);
        contactByUser.forEach((contact) => {
            deprecatedUserId.push(contact.userId);
            deprecatedUserId.push(contact.contactId);
        });
        deprecatedUserId = _.uniqBy(deprecatedUserId);
        let users = await userModel.findAllForAddContact(deprecatedUserId, keyword);
        resolve(users);
    });
};

let addNew = (currentUserId, contactId) => {
    return new Promise(async(resolve, reject) => {
        let contactExists = await contactModel.checkExists(
            currentUserId,
            contactId
        );
        if (contactExists) {
            return reject(false);
        }
        // create contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId,
        };

        let newContact = await contactModel.createNew(newContactItem);

        //create notifications

        let notifiItem = {
            senderId: currentUserId,
            recieverId: contactId,
            type: notificationModel.types.ADD_CONTACT,
        };
        await notificationModel.model.createNew(notifiItem);

        resolve(newContact);
    });
};
let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async(resolve, reject) => {
        await contactModel.removeRequestContact(currentUserId, contactId);
        await notificationModel.model.removeRequestContactNotification(
            currentUserId,
            contactId,
            notificationModel.types.ADD_CONTACT
        );
        resolve(true);
    });
};
let getContact = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.getContacts(
                currentUserId,
                LIMIT_NUMBER_TAKEN
            );
            let users = contacts.map(async(item) => {
                if (item.contactId == currentUserId) {
                    return await userModel.findUserById(item.userId);
                } else {
                    return await userModel.findUserById(item.contactId);
                }
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let getContactSent = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.getContactsSent(
                currentUserId,
                LIMIT_NUMBER_TAKEN
            );
            let users = contacts.map(async(item) => {
                return await userModel.findUserById(item.contactId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let getContactReceived = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.getContactsReceived(
                currentUserId,
                LIMIT_NUMBER_TAKEN
            );
            let users = contacts.map(async(item) => {
                return await userModel.findUserById(item.userId);
            });
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContacts = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let count = await contactModel.countAllContacts(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsSent = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let count = await contactModel.countAllContactsSent(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsReceived = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let count = await contactModel.countAllContactsReceived(currentUserId);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    findUserContact: findUserContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
    getContact: getContact,
    getContactSent: getContactSent,
    getContactReceived: getContactReceived,
    countAllContactsReceived: countAllContactsReceived,
    countAllContactsSent: countAllContactsSent,
    countAllContacts: countAllContacts,
};