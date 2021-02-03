const { register, login } = require("./../controllers/authController/index");
const {
    registerValidation,
} = require("./../validations/auth/registerValidation");
const initPassportLocal = require("./../controllers/passportController/local");
const {
    homeController,
    contactController,
    notificationController,
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

    /**
     * Site view
     */
    router.get("/", homeController.getHome);
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
    /**
     * load more notifications + mark all as read
     */
    router.get("/notification/read-more", notificationController.getMoreNotifi);
    router.put(
        "/notification/mark-all-as-read",
        notificationController.markAllAsRead
    );

    return app.use("/", router);
};
module.exports = initRouter;