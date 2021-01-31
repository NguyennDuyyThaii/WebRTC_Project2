const { notificationService } = require("./../../services/site/index")

let getHome = async(req, res) => {
    // Only 10 items one time
    let notifocations = await notificationService.getNotification(req.user._id)
        // get amount notification unread
    let countNotifUnread = await notificationService.countNotifUnread(req.user._id)
    return res.render('main/home/home', {
        notifocations: notifocations,
        countNotifUnread: countNotifUnread
    })
}
module.exports = {
    getHome: getHome,

}