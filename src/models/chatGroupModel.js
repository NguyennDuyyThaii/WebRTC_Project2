const mongoose = require("mongoose")

let Schema = mongoose.Schema

let chatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 177 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [{ userId: String }],
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: Date.now },
    deletedAt: { type: String, default: null }
})
chatGroupSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    /**
     * 
     * @param {*} userId 
     * @param {*} limit 
     */
    getGroups(userId, limit) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "updatedAt": -1 }).limit(limit).exec()
    },
    /**
     * 
     */
    getChatGroupById(receiverId) {
        return this.findById(receiverId).exec()
    },
    /**
     * 
     */
    updateWhenHasNewMessage(id, newMessageAmount) {
        return this.findByIdAndUpdate(id, {
            "messageAmount": newMessageAmount,
            "updatedAt": Date.now()
        }).exec()
    },

    getChatGroupIdByUser(userId) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }, { _id: 1 }).exec()
    },
    readMoreChatGroup(userId, skip, limit) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "updatedAt": -1 }).skip(skip).limit(limit).exec()
    }
}
module.exports = mongoose.model("chatgroup", chatGroupSchema)