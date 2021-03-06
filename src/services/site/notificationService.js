const notificationModel = require("../../models/notificationModels")
const userModel = require("./../../models/userModel")
let getNotification = (currentUserId, limit = 10) => {
    return new Promise(async(resolve, reject) => {
        try {
            let notifications = await notificationModel.model.getByUserAndLimit(currentUserId, limit)
                // map# forEach la no
                //return ra cho mk cai mang moi
            let notifContents = notifications.map(async(item) => {
                let sender = await userModel.getNormalUserById(item.senderId)
                return notificationModel.content.GET_CONTENT(item.type, item.isRead, sender._id, sender.username, sender.avatar)
            })
            resolve(await Promise.all(notifContents))
        } catch (error) {
            reject(error)
        }
    })
}

let countNotifUnread = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let notificationUnread = await notificationModel.model.countNotificationUnread(currentUserId)
            resolve(notificationUnread)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * read more notifications, max = 10 item one time
 * @param {String} currentUserId 
 * @param {Number} skipNumberNotification 
 */
let readMore = (currentUserId, skipNumberNotification) => {
        return new Promise(async(resolve, reject) => {
            try {
                let newNotifications = await notificationModel.model.readMore(currentUserId, skipNumberNotification, limit = 10)
                let notifContents = newNotifications.map(async(item) => {
                    let sender = await userModel.getNormalUserById(item.senderId)
                    return notificationModel.content.GET_CONTENT(item.type, item.isRead, sender._id, sender.username, sender.avatar)
                })
                resolve(await Promise.all(notifContents))
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * mark notification as read
     * @param {string} currentUserId 
     * @param {array} targetUsers 
     */
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async(resolve, reject) => {
        try {
            await notificationModel.model.markAllAsRead(currentUserId, targetUsers)
            resolve(true)
        } catch (error) {
            // i want return true false to client
            console.log(`Error when mark notification as read: ${error}`)
            reject(false)
        }
    })
}
module.exports = {
    getNotification: getNotification,
    countNotifUnread: countNotifUnread,
    readMore: readMore,
    markAllAsRead: markAllAsRead
}