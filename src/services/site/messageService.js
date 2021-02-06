const contactModel = require('./../../models/contactModel')
const userModel = require('./../../models/userModel')
const chatGroupModel = require('./../../models/chatGroupModel')
const _ = require("lodash")
const LIMIT_NUMBER_TAKEN = 150
const LIMIT_MESSAGE_TAKEN = 30
const messageModel = require('./../../models/messageModel')
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
                    getUserContact.updatedAt = item.updatedAt
                    return getUserContact
                } else {
                    let getUserContact = await userModel.getNormalUserById(item.userId);
                    // if item.createdAt is string, before assign that getUserContact = getUserContact.toObject()
                    getUserContact.updatedAt = item.updatedAt
                    return getUserContact
                }
            });
            let userConversations = await Promise.all(userConversationsPromise)
            let groupConversations = await chatGroupModel.getGroups(currentUserId, LIMIT_NUMBER_TAKEN)
            let allConversations = userConversations.concat(groupConversations)
            allConversations = _.sortBy(allConversations, (item) => {
                return -item.updatedAt
            })


            // get message to apply in screen chat
            let allConversationsWithMesagePromise = allConversations.map(async(item) => {
                let getMessages = await messageModel.model.getMessages(currentUserId, item._id, LIMIT_MESSAGE_TAKEN)

                item = item.toObject()
                item.messages = getMessages
                return item
            })
            let allConversationsWithMesage = await Promise.all(allConversationsWithMesagePromise)
                // avoid sort not right createdAt
            allConversationsWithMesage = _.sortBy(allConversationsWithMesage, (item) => {
                return -item.updatedAt
            })

            resolve({
                userConversations: userConversations,
                groupConversations: groupConversations,
                allConversations: allConversations,
                allConversationsWithMesage: allConversationsWithMesage
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllConversationItems: getAllConversationItems
}