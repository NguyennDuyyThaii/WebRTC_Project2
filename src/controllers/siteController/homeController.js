const { notificationService } = require("./../../services/site/index")

let getHome = async(req, res) => {
    let notifocations = await notificationService.getNotification(req.user._id)
    return res.render('main/home/home', {
        notifocations: notifocations
    })
}
module.exports = {
    getHome: getHome,

}