const contactModel = require('./../../models/contactModel')
const userModel = require('./../../models/userModel')
const chatGroupModel = require('./../../models/chatGroupModel')
const _ = require("lodash")
const LIMIT_NUMBER_TAKEN = 10
const LIMIT_MESSAGE_TAKEN = 30
const messageModel = require('./../../models/messageModel')
const fsExtra = require("fs-extra")
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
    /**
     * 
     * @param {*} sender currentuser i
     * @param {*} receiverId 
     * @param {*} messageVal 
     * @param {*} isChatGroup 
     */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
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
                        // chuyen sang buffer de luu vao database
                    let imageBuffer = await fsExtra.readFile(messageVal.path)
                    let imageContentType = messageVal.mimeType
                    let imageName = messageVal.originalname

                    let newMessageItem = {
                        senderId: sender.id,
                        receiverId: receiver.id,
                        conversationType: messageModel.conversationType.GROUP,
                        messageType: messageModel.messageType.IMAGE,
                        sender: sender,
                        receiver: receiver,
                        file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
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
                    let imageBuffer = await fsExtra.readFile(messageVal.path)
                    let imageContentType = messageVal.mimeType
                    let imageName = messageVal.originalname
                    let newMessageItem = {
                        senderId: sender.id,
                        receiverId: receiver.id,
                        conversationType: messageModel.conversationType.PERSONAL,
                        messageType: messageModel.messageType.IMAGE,
                        sender: sender,
                        receiver: receiver,
                        file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
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
    /**
     * 
     * @param {*} sender 
     * @param {*} receiverId 
     * @param {*} messageVal 
     * @param {*} isChatGroup 
     * @returns 
     */
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
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
                        // chuyen sang buffer de luu vao database
                    let attachmentBuffer = await fsExtra.readFile(messageVal.path)
                    let attachmentContentType = messageVal.mimeType
                    let attachmentName = messageVal.originalname

                    let newMessageItem = {
                        senderId: sender.id,
                        receiverId: receiver.id,
                        conversationType: messageModel.conversationType.GROUP,
                        messageType: messageModel.messageType.FILE,
                        sender: sender,
                        receiver: receiver,
                        file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
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
                    let attachmentBuffer = await fsExtra.readFile(messageVal.path)
                    let attachmentContentType = messageVal.mimeType
                    let attachmentName = messageVal.originalname

                    let newMessageItem = {
                        senderId: sender.id,
                        receiverId: receiver.id,
                        conversationType: messageModel.conversationType.PERSONAL,
                        messageType: messageModel.messageType.FILE,
                        sender: sender,
                        receiver: receiver,
                        file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
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
    /**
     * read more personal and group chat
     * @param {string} currentUserId 
     * @param {number} skipPersonNal 
     * @param {number} skipGroup 
     * @returns 
     */
let realMoreAllChat = (currentUserId, skipPersonNal, skipGroup) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.readMore(
                currentUserId,
                skipPersonNal,
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

            let groupConversations = await chatGroupModel.readMoreChatGroup(currentUserId, skipGroup, LIMIT_NUMBER_TAKEN)
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

            resolve(allConversationsWithMesage)
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    realMoreAllChat: realMoreAllChat
}