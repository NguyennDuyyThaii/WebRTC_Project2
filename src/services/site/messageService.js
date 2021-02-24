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
                    let getUserContact = await userModel.getNormalUserById(item.contactId);
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
                item = item.toObject()


                if (item.members) {
                    let getMessages = await messageModel.model.getMessagesInGroup(item._id, LIMIT_MESSAGE_TAKEN)
                    item.messages = _.reverse(getMessages)
                } else {
                    let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId, item._id, LIMIT_MESSAGE_TAKEN)
                    item.messages = _.reverse(getMessages)
                }
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

let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (isChatGroup) {
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId)
                if (!getChatGroupReceiver) {
                    return reject("Không tồn tại cuộc trò chuyện")
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: "group-avatar-trungquandev.png"
                }
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageModel.conversationType.GROUP,
                    messageType: messageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                }
                let newMessage = await messageModel.model.createNew(newMessageItem)
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1)
                resolve(newMessage)
            } else {
                let getChatUserReceiver = await userModel.getNormalUserById(receiverId)
                if (!getChatUserReceiver) {
                    return reject("Không tồn tại cuộc trò chuyện")
                }
                let receiver = {
                    id: getChatUserReceiver._id,
                    name: getChatUserReceiver.username,
                    avatar: getChatUserReceiver.avatar
                }
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: messageModel.conversationType.PERSONAL,
                    messageType: messageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                }
                let newMessage = await messageModel.model.createNew(newMessageItem)
                await contactModel.updateWhenHasNewMessage(sender.id, getChatUserReceiver._id)
                resolve(newMessage)
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji
}