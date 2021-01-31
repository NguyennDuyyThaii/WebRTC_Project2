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
    removeRequestContactNotification(senderId, recieverId, type) {
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
    }

}
const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact"
}
const NOTIFICATION_CONTENT = {
    GET_CONTENT: (notificationType, isRead, userId, username, userAvatar) => {
        if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
            if (!isRead) {
                return `<span class="notif-readed-false" data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </span><br><br><br>`
            }
            return `<span data-uid="${userId}">
            <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
            <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
        </span><br><br><br>`

        }
        return "No matching with any notification type"
    }
}
module.exports = {
    model: mongoose.model("notification", notificationSchema),
    types: NOTIFICATION_TYPES,
    content: NOTIFICATION_CONTENT
}