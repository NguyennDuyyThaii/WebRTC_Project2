const { notificationService, contactService, messageService } = require("./../../services/site/index");
const { bufferToBase64, lastItemOfArray, convertTime } = require("./../../helpers/clientHelper")
const request = require("request");
let getICETurnServer = () => {
    return new Promise(async(resolve, reject) => {
        // Node Get ICE STUN and TURN list
        // let o = {
        //     format: "urls"
        // };

        // let bodyString = JSON.stringify(o);

        // let options = {
        //     url: "https://global.xirsys.net/_turn/project-chat",
        //     method: "PUT",
        //     headers: {
        //         "Authorization": "Basic " + Buffer.from("nguyenduythai:80690730-83c8-11eb-9f95-0242ac150002").toString("base64"),
        //         "Content-Type": "application/json",
        //         "Content-Length": bodyString.length
        //     }
        // };
        // // call a request to get ICE list of turn server
        // request(options, (error, response, body) => {
        //     if (error) {
        //         return reject(error);
        //     }
        //     // tra ve client luc nao cung la phai json, typeof body la string nhe => nen phai chon
        //     // console.log(body)
        //     // console.log(typeof body)
        //     let bodyJson = JSON.parse(body) // Object
        //     resolve(bodyJson.v.iceServers)
        // })
        resolve([])
    })
}

let getHome = async(req, res) => {
    // Only 10 items one time
    let notifocations = await notificationService.getNotification(req.user._id);
    // get amount notification unread
    let countNotifUnread = await notificationService.countNotifUnread(
        req.user._id
    );
    // get contacts 10 items one time
    let contacts = await contactService.getContact(req.user._id)
        // get contacts sent 10 items one time
    let contactsSent = await contactService.getContactSent(req.user._id)
        // get contacts received 10 items on time
    let contactsReceived = await contactService.getContactReceived(req.user._id)

    // count contacts
    let countAllContacts = await contactService.countAllContacts(req.user._id)
    let countAllContactsSent = await contactService.countAllContactsSent(req.user._id)
    let countAllContactsReceived = await contactService.countAllContactsReceived(req.user._id)

    let getAllConversationItems = await messageService.getAllConversationItems(req.user._id)

    // let allConversations = getAllConversationItems.allConversations
    // let userConversations = getAllConversationItems.userConversations
    // let groupConversations = getAllConversationItems.groupConversations
    let allConversationsWithMesage = getAllConversationItems.allConversationsWithMesage

    // get ICE list from xirsys turn server
    let iceServerList = await getICETurnServer()
    return res.render("main/home/home", {
        notifocations: notifocations,
        countNotifUnread: countNotifUnread,
        contacts: contacts,
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllContactsReceived: countAllContactsReceived,
        countAllContactsSent: countAllContactsSent,
        countAllContacts: countAllContacts,
        getAllConversationItems: getAllConversationItems,
        allConversationsWithMesage: allConversationsWithMesage,
        user: req.user,
        bufferToBase64: bufferToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTime: convertTime,
        iceServerList: JSON.stringify(iceServerList),
        success: req.flash("success")
    });
};
let getLogout = (req, res) => {
    req.logout()
    req.flash("success", "Đăng xuất tài khoản thành công, hẹn gặp lại!")
    return res.redirect("/login")
}
let checkloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}
let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
module.exports = {
    getHome: getHome,
    getLogout: getLogout,
    checkLoggedOut: checkLoggedOut,
    checkloggedIn: checkloggedIn
};