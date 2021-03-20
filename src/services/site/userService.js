const userModel = require('../../models/userModel')

let updateAvatar = (id, updateUserItem) => {

    return userModel.updateUser(id, updateUserItem)

}
module.exports = {
    updateAvatar: updateAvatar
}