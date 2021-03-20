const userModel = require('../../models/userModel')

let updateUser = (id, updateUserItem) => {

    return userModel.updateUser(id, updateUserItem)

}
module.exports = {
    updateUser: updateUser
}