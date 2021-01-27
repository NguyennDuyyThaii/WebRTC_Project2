const mongoose = require("mongoose")

let Schema = mongoose.Schema

let contactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null }
})
contactSchema.statics = {
    /**
     * create a new item
     * @param {*} item 
     */
    createNew(item) {
        return this.create(item)
    },
    /**
     * Find all item
     * @param {*} userId 
     */
    findAllByUser(userId) {
        return this.find({
            $or: [
                { "userId": userId },
                { "contactId": userId }
            ]
        }).exec()
    },
    /**
     * check exists of 2 user
     * @param {*} userId 
     * @param {*} contactId 
     */
    checkExists(userId, contactId) {
        return this.findOne({
            $or: [
                {
                    $and: [
                        { "userId": userId },
                        { "contactId": contactId }
                    ]
                },
                {
                    $and: [
                        { "userId": contactId },
                        { "contactId": userId }
                    ]
                }
            ]
        }).exec()
    },
    /**
     * remove request contact
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeRequestContact(userId, contactId) {
        return this.deleteOne({
                $and: [
                    { "userId": userId }, 
                    { "contactId": contactId }
                ]
            }).exec()
    }
}
module.exports = mongoose.model('contact', contactSchema)