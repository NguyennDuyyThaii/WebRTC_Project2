const mongoose = require("mongoose")

let Schema = mongoose.Schema

let messageSchema = new Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
        avatar: String
    },
    text: String,
    file: { data: Buffer, contentType: String, fileName: String },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
})
messageSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    getMessagesInPersonal(senderId, receiverId, limit) {
        return this.find({
            $or: [{
                    $and: [
                        { "senderId": senderId },
                        { "receiverId": receiverId }
                    ]
                },
                {
                    $and: [
                        { "receiverId": senderId },
                        { "senderId": receiverId }
                    ]
                }
            ]
        }).sort({ "createdAt": -1 }).limit(limit).exec()
    },
    getMessagesInGroup(receiverId, limit) {
        return this.find({ "receiverId": receiverId }).sort({ "createdAt": -1 }).limit(limit).exec()
    }
}
const MESSAGE_CONVERSATION_TYPE = {
    PERSONAL: "personal",
    GROUP: "group"
}
const MESSAGE_TYPE = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
}
module.exports = {
    model: mongoose.model("message", messageSchema),
    conversationType: MESSAGE_CONVERSATION_TYPE,
    messageType: MESSAGE_TYPE
}