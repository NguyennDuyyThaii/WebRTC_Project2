const { notificationService, contactService, messageService } = require("./../../services/site/index");

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

    let allConversations = getAllConversationItems.allConversations
    let userConversations = getAllConversationItems.userConversations
    let groupConversations = getAllConversationItems.groupConversations
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
        allConversations: allConversations,
        userConversations: userConversations,
        groupConversations: groupConversations
    });
};
module.exports = {
    getHome: getHome,
};