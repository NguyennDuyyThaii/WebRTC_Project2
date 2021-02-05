const contactModel = require('./../../models/contactModel')
const userModel = require('./../../models/userModel')
const chatGroupModel = require('./../../models/chatGroupModel')
const _ = require("lodash")
const LIMIT_NUMBER_TAKEN = 150
let getAllConversationItems = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.getContacts(
                currentUserId,
                LIMIT_NUMBER_TAKEN
            );
            let userConversationsPromise = contacts.map(async(item) => {
                if (item.contactId == currentUserId) {
                    let getUserContact = await userModel.getNormalUserById(item.userId);
                    // if item.createdAt is string, before assign that getUserContact = getUserContact.toObject()
                    getUserContact.createdAt = item.createdAt
                    return getUserContact
                } else {
                    let getUserContact = await userModel.getNormalUserById(item.userId);
                    // if item.createdAt is string, before assign that getUserContact = getUserContact.toObject()
                    getUserContact.createdAt = item.createdAt
                    return getUserContact
                }
            });
            let userConversations = await Promise.all(userConversationsPromise)
            let groupConversations = await chatGroupModel.getGroups(currentUserId, LIMIT_NUMBER_TAKEN)
            let allConversations = userConversations.concat(groupConversations)
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.createdAt
            })
            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllConversationItems: getAllConversationItems
}