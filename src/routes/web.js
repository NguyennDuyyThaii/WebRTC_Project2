const { register, login } = require("./../controllers/authController/index");
const {
    registerValidation
} = require("./../validations/auth/registerValidation");
const {
    messageValidation,
    contactValidate,
    groupChatValidation
} = require("./../validations/index")
const initPassportLocal = require("./../controllers/passportController/local");
const {
    homeController,
    contactController,
    notificationController,
    messageController,
    groupChatController,
    userController
} = require("./../controllers/siteController/index");
/**
 * config libraly
 */
const express = require("express");
const passport = require("passport");
const router = express.Router();

/**
 * initPassport
 */
initPassportLocal();
/**
 * router
 * @param {*} app
 */
let initRouter = (app) => {
    /**
     * SignIn-SignUp
     */
    router.get("/login", login.getLogin);
    router.post(
        "/login",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true,
        })
    );
    router.get("/register", register.getRegister);
    router.post("/register", registerValidation, register.postRegister);
    router.get("/verify/:token", register.verify);

    router.put('/user/update-avatar', userController.updateAvatar)
        /**
         * Site view
         */
    router.get("/", homeController.getHome);
    router.get('/logout', homeController.getLogout);
    /**
     * Find User to contact, add contact, destroy contact
     */
    router.get("/contact/find-user/:keyword", contactController.findUserContact);
    router.post("/contact/add-new-contact", contactController.addNewContact);
    router.delete(
        "/contact/remove-request-contact-sent",
        contactController.removeRequestContactSent
    );
    router.get("/contacts/read-more", contactController.getMoreContact);
    router.get("/contacts/read-more-sent", contactController.getMoreContactSent);
    router.get(
        "/contacts/read-more-received",
        contactController.getMoreContactReceived
    );
    router.delete('/contact/remove-request-contact-received', contactController.removeRequestContactReceived)
    router.put('/contact/approve-request-contact-received', contactController.approveRequestContactReceived)
    router.delete('/contact/user-remove-contact', contactController.removeContact)
        /**
         * load more notifications + mark all as read
         */
    router.get("/notification/read-more", notificationController.getMoreNotifi);
    router.put(
        "/notification/mark-all-as-read",
        notificationController.markAllAsRead
    );
    router.post('/messages/add-new-image', messageController.addNewImage)
    router.post('/messages/add-new-attachment', messageController.addNewAttachment)
        /**
         * 
         */
        // chat-group
    router.get("/contact/search-friend/:keyword", contactValidate.searchFriends, contactController.searchFriends);
    router.post("/group-chat/add-new", groupChatValidation.addNewGroup, groupChatController.addNewGroup)

    router.post('/message/add-new-text-emoji', messageValidation.checkMessageLength, messageController.addNewTextEmoji)

    router.get('/message/read-more-all-chat', messageController.realMoreAllChat)

    return app.use("/", router);
};
module.exports = initRouter;