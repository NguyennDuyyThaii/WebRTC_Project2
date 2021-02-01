const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let contactSchema = new Schema({
    userId: String,
    contactId: String,
    status: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
});
contactSchema.statics = {
    /**
     * create a new item
     * @param {*} item
     */
    createNew(item) {
        return this.create(item);
    },
    /**
     * Find all item
     * @param {*} userId
     */
    findAllByUser(userId) {
        return this.find({
            $or: [{ userId: userId }, { contactId: userId }],
        }).exec();
    },
    /**
     * check exists of 2 user
     * @param {*} userId
     * @param {*} contactId
     */
    checkExists(userId, contactId) {
        return this.findOne({
            $or: [{
                    $and: [{ userId: userId }, { contactId: contactId }],
                },
                {
                    $and: [{ userId: contactId }, { contactId: userId }],
                },
            ],
        }).exec();
    },
    /**
     * remove request contact
     * @param {*} userId
     * @param {*} contactId
     */
    removeRequestContact(userId, contactId) {
        return this.deleteOne({
            $and: [{ userId: userId }, { contactId: contactId }],
        }).exec();
    },
    /**
     *
     * @param {*} userId
     * @param {*} limit
     */
    getContacts(userId, limit) {
        return this.find({
                $and: [{
                        $or: [{ userId: userId }, { contactId: userId }],
                    },
                    { status: true },
                ],
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    /**
     *
     * @param {*} userId
     * @param {*} limit
     */
    getContactsSent(userId, limit) {
        return this.find({
                $and: [{ userId: userId }, { status: false }],
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    /**
     *
     * @param {*} userId
     * @param {*} limit
     */
    getContactsReceived(userId, limit) {
        return this.find({
                $and: [{ contactId: userId }, { status: false }],
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    },
    /**
     *
     * @param {*} userId
     */
    countAllContacts(userId) {
        return this.countDocuments({
            $and: [{
                    $or: [{ userId: userId }, { contactId: userId }],
                },
                { status: true },
            ],
        }).exec();
    },
    /**
     *
     * @param {*} userId
     */
    countAllContactsSent(userId) {
        return this.countDocuments({
            $and: [{ userId: userId }, { status: false }],
        }).exec();
    },
    /**
     *
     * @param {*} userId
     */
    countAllContactsReceived(userId) {
        return this.countDocuments({
            $and: [{ contactId: userId }, { status: false }],
        }).exec();
    },
};
module.exports = mongoose.model("contact", contactSchema);