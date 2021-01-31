const { notificationService } = require("./../../services/site/index")
let getMoreNotifi = async(req, res) => {
    try {
        // let skip number from query
        let skipNumberNotification = +(req.query.skipNumber)
            // skipNumberNotif type is String, so + to convert to number
        let newNotification = await notificationService.readMore(req.user._id, skipNumberNotification)
        return res.status(200).send(newNotification)
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    getMoreNotifi: getMoreNotifi
}