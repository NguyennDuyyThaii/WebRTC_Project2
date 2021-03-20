const multer = require('multer')
const uuid = require("uuid")
const { app } = require("../../configs/app")
const { transUpdateUser } = require("../../../lang/vi")
const { userService } = require("./../../services/site/index")
const fs = require("fs-extra")
let storageAvatar = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, app.avatar_directory)
    },
    filename: (req, file, callback) => {
        let math = app.avatar_type
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transUpdateUser.avatar_type, null)
        }
        let avatarName = `${Date.now()}-${file.originalname}`
        callback(null, avatarName)
    }
})
let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_size }
    // thằng multer ấy nó chưa hỗ chợ cái validata File Too large đâu, vậy nên phải ghi đè
}).single("avatar")
let updateAvatar = async(req, res) => {
    avatarUploadFile(req, res, async(error) => {
        if (error) {
            // message nay la cho thang Size do
            if (error.message) {
                return res.status(500).send(transUpdateUser.avatar_size)
            }
            return res.status(500).send(error)
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            }
            let userUpdate = await userService.updateAvatar(req.user._id, updateUserItem)

            // remove old user avatar
            // cac ham update se return old item before update nha
            fs.remove(`${app.avatar_directory}/${userUpdate.avatar}`)

            let result = {
                message: transUpdateUser.avatar_updated,
                imgSrc: `/libraries/images/users/${req.file.filename}`
            }
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error)
        }
    })
}

module.exports = {
    updateAvatar: updateAvatar
}