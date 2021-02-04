const mongoose = require("mongoose")

let Schema = mongoose.Schema

let notificationSchema = new Schema({
    senderId: String,
    recieverId: String,
    type: String,
    isRead: { type: String, default: false },
    createdAt: { type: Number, default: Date.now }
})
notificationSchema.statics = {
    /**
     * create new
     * @param {*} item 
     */
    createNew(item) {
        return this.create(item)
    },
    /**
     * remove
     */
    removeRequestContactSentNotification(senderId, recieverId, type) {
        return this.deleteOne({
            $and: [
                { "senderId": senderId },
                { "recieverId": recieverId },
                { "type": type }
            ]
        }).exec()
    },
    /**
     * get notifiCation of a user and limit iy
     * @param {*} userId 
     * @param {*} limit 
     */
    getByUserAndLimit(userId, limit) {
        return this.find({
            "recieverId": userId
        }).sort({ "createdAt": -1 }).limit(limit).exec()
    },
    /**
     * count notif unread
     * @param {*} userId 
     */
    countNotificationUnread(userId) {
        return this.countDocuments({
            $and: [
                { "recieverId": userId },
                { "isRead": false }
            ]
        }).exec()
    },
    /**
     * read more noti
     * @param {*} userId 
     * @param {*} skip dont care first 10 item, take next 10 item
     * @param {*} limit 
     */
    readMore(userId, skip, limit) {
        return this.find({
            "recieverId": userId
        }).sort({ "createdAt": -1 }).skip(skip).limit(limit).exec()
    },
    /**
     * mark notification as read
     * @param {string} userId 
     * @param {array} targetUsers 
     */
    markAllAsRead(userId, targetUsers) {
        return this.updateMany({
            $and: [
                { "recieverId": userId },
                { "senderId": { $in: targetUsers } }
            ]
        }, { "isRead": true }).exec()
    }

}
const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
    APPROVE_CONTACT: "approve_contact"
}
const NOTIFICATION_CONTENT = {
    GET_CONTENT: (notificationType, isRead, userId, username, userAvatar) => {
        if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
            if (!isRead) {
                return `<div class="notif-readed-false" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </div>`
            }
            return `<div data-uid="${userId}">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
        </div>`

        }
        if (notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT) {
            if (!isRead) {
                return `<div class="notif-readed-false" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${username}</strong> đã chấp nhận lời mời kết bạn!
            </div>`
            }
            return `<div data-uid="${userId}">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đã chấp nhận lời mời kết bạn!
        </div>`

        }
        return "No matching with any notification type"
    }
}
module.exports = {
    model: mongoose.model("notification", notificationSchema),
    types: NOTIFICATION_TYPES,
    content: NOTIFICATION_CONTENT
}