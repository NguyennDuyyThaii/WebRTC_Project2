const { validationResult } = require("express-validator")
const { messageService } = require("./../../services/site/index")
const fsExtra = require("fs-extra")
const multer = require("multer")
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

let storageAvatar = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "src/public/libraries/images/chat/message")
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg", "image/jpg"]

        if (math.indexOf(file.mimetype) === -1) {
            return callback("Không đúng định dạng", null)
        }
        // tuỳ cách truyền, để xoá file cho tiện
        let imageName = `${file.originalname}`
        callback(null, imageName)
    }
})
let imageMessageUploadFile = multer({
    storage: storageAvatar,
    limits: { fileSize: 1048576 }
}).single("my-image-chat")
let addNewImage = (req, res) => {
    imageMessageUploadFile(req, res, async(error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send("Không thể tìm được nơi lưu trữ");
            }
            return res.status(500).send(error)
        }

        try {
            let sender = {
                    id: req.user._id,
                    name: req.user.username,
                    avatar: req.user.avatar
                }
                // lay tu cai key messageFormData.append("uid", targetId)
            let receiverId = req.body.uid
            let messageVal = req.file
            let isChatGroup = req.body.isChatGroup

            let newMessage = await messageService.addNewImage(sender, receiverId, messageVal, isChatGroup)

            // remove image, becasue this image is saved to mongodb
            await fsExtra.remove(`src/public/libraries/images/chat/message/${newMessage.file.fileName}`)
            return res.status(200).send({ message: newMessage })
        } catch (error) {
            return res.status(500).send(error)
        }
    })
}
module.exports = {
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage
}