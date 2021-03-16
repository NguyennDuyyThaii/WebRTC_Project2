const { validationResult } = require("express-validator")
const { groupChatService } = require("./../../services/site/index")
let addNewGroup = async(req, res) => {
    let errorsArr = []
    let validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped())
        errors.forEach(item => {
            errorsArr.push(item.msg)
        })
        return res.status(500).send(errorsArr)
    }
    try {
        let currentUserId = req.user._id
        let arrayMemberIds = req.body.arrayIds
        let groupChatName = req.body.groupChatName

        let newGroupChat = await groupChatService.addNewGroup(currentUserId, arrayMemberIds, groupChatName)
        return res.status(200).send({ groupChat: newGroupChat })
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    addNewGroup: addNewGroup
}