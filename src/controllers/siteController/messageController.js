const { validationResult } = require("express-validator")
const { messageService } = require("./../../services/site/index")
let addNewTextEmoji = async(req, res) => {
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
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid
        let messageVal = req.body.messageVal
        let isChatGroup = req.body.isChatGroup

        let newMessage = await messageService.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup)
        return res.status(200).send({ message: newMessage })
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    addNewTextEmoji: addNewTextEmoji
}