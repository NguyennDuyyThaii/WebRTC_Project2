const { validationResult } = require("express-validator")
const { messageService } = require("./../../services/site/index")
const fsExtra = require("fs-extra")
const multer = require("multer")
const ejs = require("ejs")
const { lastItemOfArray, convertTime, bufferToBase64 } = require("./../../helpers/clientHelper")
const { promisify } = require("util")

// make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs)


// handle text imoji chat
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
    // handle imageChat
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
    // handle attachment chat
let storageAttachmentChat = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "src/public/libraries/images/chat/message")
    },
    filename: (req, file, callback) => {
        // tuỳ cách truyền, để xoá file cho tiện
        let attachmentName = `${file.originalname}`
        callback(null, attachmentName)
    }
})
let attachmentMessageUploadFile = multer({
    storage: storageAttachmentChat,
    limits: { fileSize: 1048576 }
}).single("my-attachment-chat")

let addNewAttachment = (req, res) => {
    attachmentMessageUploadFile(req, res, async(error) => {
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

            let newMessage = await messageService.addNewAttachment(sender, receiverId, messageVal, isChatGroup)

            // remove image, becasue this image is saved to mongodb
            await fsExtra.remove(`src/public/libraries/images/chat/message/${newMessage.file.fileName}`)
            return res.status(200).send({ message: newMessage })
        } catch (error) {
            return res.status(500).send(error)
        }
    })
}

let realMoreAllChat = async(req, res) => {
    try {
        // + dua ve dang number neu khong no la dangj string
        let skipPersonNal = +(req.query.skipPersonNal)
        let skipGroup = +(req.query.skipGroup)

        let newAllConversations = await messageService.realMoreAllChat(req.user._id, skipPersonNal, skipGroup)

        let dataToRender = {
                newAllConversations: newAllConversations,
                lastItemOfArray: lastItemOfArray,
                convertTime: convertTime,
                bufferToBase64: bufferToBase64,
                user: req.user
            }
            // cái này nó chưa hỗ trợ Promise đâu nhá => dung promisify
            // ejs.renderFile(src/views/main/readMoreConversations/_leftSide.ejs, dataToRender, {}, function(err, str) {
            //     if (err) {
            //         console.log(err)
            //         return
            //     }
            //     console.log(str)
            // });
        let leftSideData = await renderFile("src/views/main/readMoreConversations/_leftSide.ejs", dataToRender)
        let rightSideData = await renderFile("src/views/main/readMoreConversations/_rightSide.ejs", dataToRender)
        let imageSideData = await renderFile("src/views/main/readMoreConversations/_imageModal.ejs", dataToRender)
        let attachmentSideData = await renderFile("src/views/main/readMoreConversations/_attachmentModal.ejs", dataToRender)

        return res.status(200).send({
            leftSideData: leftSideData,
            rightSideData: rightSideData,
            imageSideData: imageSideData,
            attachmentSideData: attachmentSideData
        })
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    realMoreAllChat: realMoreAllChat
}