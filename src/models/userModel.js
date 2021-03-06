const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    gender: { type: String, default: null },
    avatar: { type: String, default: null },
    address: { type: String, default: null },
    local: {
        email: { type: String, trim: true },
        password: String,
        isActive: { type: Boolean, default: false },
        verifyToken: String,
    },
    facebook: {
        email: { type: String, trim: true },
        uid: String,
        token: String,
    },
    google: {
        email: { type: String, trim: true },
        uid: String,
        token: String,
    },
    createdAt: { type: String, default: Date.now },
    updatedAt: { type: String, default: null },
    deletedAt: { type: String, default: null },
});
UserSchema.statics = {
    /**
     * create method
     */
    createNew(item) {
        return this.create(item);
    },
    updateUser(id, item) {
        return this.findByIdAndUpdate(id, item).exec()
    },
    /**
     * check email user had existed
     */
    findByEmail(email) {
        return this.findOne({ "local.email": email }).exec();
    },
    /**
     * remove a account
     */
    removeById(id) {
        return this.findByIdAndRemove(id).exec();
    },
    /**
     * update account after click the link
     */
    verify(token) {
        return this.findOneAndUpdate({ "local.verifyToken": token }, { "local.isActive": true, "local.verifyToken": null });
    },
    /**
     * find a user by id
     */
    findUserById(id) {
        return this.findById(id, { "local.password": 0 }).exec();
    },
    findUser(id) {
        return this.findById(id).exec();
    },
    /**
     * find all user not friend to add contact
     * @param {*} deprecatedUserId
     * @param {*} keyword
     */
    findAllForAddContact(deprecatedUserId, keyword) {
        return this.find({
            $and: [
                { "_id": { $nin: deprecatedUserId } },
                { "local.isActive": true },
                {
                    $or: [
                        { "username": { "$regex": new RegExp(keyword, "i") } },
                        { "local.email": { "$regex": new RegExp(keyword, "i") } },
                    ],
                },
            ],
        }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
    /**
     * 
     * @param {*} id 
     */
    getNormalUserById(id) {
        return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
    /**
     * 
     * @returns 
     */
    findAllToAddGroupChat(friendsId, keyword) {
        return this.find({
            $and: [
                { "_id": { $in: friendsId } },
                { "local.isActive": true },
                {
                    $or: [
                        { "username": { "$regex": new RegExp(keyword, "i") } },
                        { "local.email": { "$regex": new RegExp(keyword, "i") } },
                    ],
                },
            ],
        }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
    updatePassword(id, hashPassword) {
        return this.findByIdAndUpdate(id, { "local.password": hashPassword }).exec();
    }
};
UserSchema.methods = {
    comparePassword(password) {
        return bcrypt.compare(password, this.local.password);
    },
};
module.exports = mongoose.model("user", UserSchema);