const userModel = require('../../models/userModel')
const { transUpdateUser } = require("./../../../lang/vi")
const bcrypt = require("bcrypt")
const saltRounds = 7
let updateUser = (id, updateUserItem) => {
    return userModel.updateUser(id, updateUserItem)
}
let updatePassword = (id, updatePasswordItem) => {
    return new Promise(async(resolve, reject) => {
        let currentUser = await userModel.findUser(id)
        if (!currentUser) {
            return reject(transUpdateUser.account_undifined)
        }

        let checkCurrentPassword = await currentUser.comparePassword(updatePasswordItem.currentPassword)
        if (!checkCurrentPassword) {
            return reject(transUpdateUser.current_password_failed)
        }

        let salt = bcrypt.genSaltSync(saltRounds)
        await userModel.updatePassword(id, bcrypt.hashSync(updatePasswordItem.newPassword, salt));
        resolve(true)
    })
}
module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword
}