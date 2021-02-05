const mongoose = require("mongoose")

let Schema = mongoose.Schema

let chatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 177 },
    messageAmount: { type: Number, default: 0 },
    userId: String,
    members: [{ userId: String }],
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
})
chatGroupSchema.statics = {
    /**
     * 
     * @param {*} userId 
     * @param {*} limit 
     */
    getGroups(userId, limit) {
        return this.find({
            "members": { $elemMatch: { "userId": userId } }
        }).sort({ "createdAt": -1 }).limit(limit).exec()
    }
}
module.exports = mongoose.model("chatgroup", chatGroupSchema)