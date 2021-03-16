const _ = require('lodash')
const chatGroupModel = require("./../../models/chatGroupModel")
let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async(resolve, reject) => {
        try {
            // add current userId to array members
            // unshift push to the top of array
            arrayMemberIds.unshift({ userId: `${currentUserId}` })
                // console.log(arrayMemberIds) thi currentUserId no la Object => ${} de covert sang string
            arrayMemberIds = _.uniqBy(arrayMemberIds, 'userId')

            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: `${currentUserId}`,
                members: arrayMemberIds
            }
            let newGroup = await chatGroupModel.createNew(newGroupItem)
            resolve(newGroup)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    addNewGroup: addNewGroup
}