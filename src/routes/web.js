const { register, login } = require("./../controllers/authController/index");
const {
    registerValidation
} = require("./../validations/auth/registerValidation");
const {
    messageValidation,
    contactValidate,
    groupChatValidation,
    userValidation
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
    router.get("/login", homeController.checkLoggedOut, login.getLogin);
    router.post(
        "/login", homeController.checkLoggedOut,
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true,
        })
    );
    router.get("/register", homeController.checkLoggedOut, register.getRegister);
    router.post("/register", homeController.checkLoggedOut, registerValidation, register.postRegister);
    router.get("/verify/:token", homeController.checkLoggedOut, register.verify);

    router.put('/user/update-avatar', homeController.checkloggedIn, userValidation.updateInfo, userController.updateAvatar)
    router.put('/user/update-info', homeController.checkloggedIn, userValidation.updateInfo, userController.updateUserInfo)
    router.put('/user/update-password', homeController.checkloggedIn, userValidation.updatePassword, userController.updatePassword)
        /**
         * Site view
         */
    router.get("/", homeController.checkloggedIn, homeController.getHome);
    router.get('/logout', homeController.checkloggedIn, homeController.getLogout);
    /**
     * Find User to contact, add contact, destroy contact
     */
    router.get("/contact/find-user/:keyword", homeController.checkloggedIn, contactController.findUserContact);
    router.post("/contact/add-new-contact", homeController.checkloggedIn, contactController.addNewContact);
    router.delete(
        "/contact/remove-request-contact-sent", homeController.checkloggedIn,
        contactController.removeRequestContactSent
    );
    router.get("/contacts/read-more", homeController.checkloggedIn, contactController.getMoreContact);
    router.get("/contacts/read-more-sent", homeController.checkloggedIn, contactController.getMoreContactSent);
    router.get(
        "/contacts/read-more-received", homeController.checkloggedIn,
        contactController.getMoreContactReceived
    );
    router.delete('/contact/remove-request-contact-received', homeController.checkloggedIn, contactController.removeRequestContactReceived)
    router.put('/contact/approve-request-contact-received', homeController.checkloggedIn, contactController.approveRequestContactReceived)
    router.delete('/contact/user-remove-contact', homeController.checkloggedIn, contactController.removeContact)
        /**
         * load more notifications + mark all as read
         */
    router.get("/notification/read-more", homeController.checkloggedIn, notificationController.getMoreNotifi);
    router.put(
        "/notification/mark-all-as-read", homeController.checkloggedIn,
        notificationController.markAllAsRead
    );
    router.post('/messages/add-new-image', homeController.checkloggedIn, messageController.addNewImage)
    router.post('/messages/add-new-attachment', homeController.checkloggedIn, messageController.addNewAttachment)
        /**
         * 
         */
        // chat-group
    router.get("/contact/search-friend/:keyword", homeController.checkloggedIn, contactValidate.searchFriends, contactController.searchFriends);
    router.post("/group-chat/add-new", homeController.checkloggedIn, groupChatValidation.addNewGroup, groupChatController.addNewGroup)

    router.post('/message/add-new-text-emoji', homeController.checkloggedIn, messageValidation.checkMessageLength, messageController.addNewTextEmoji)

    router.get('/message/read-more-all-chat', homeController.checkloggedIn, messageController.realMoreAllChat)

    return app.use("/", router);
};
module.exports = initRouter;