const { check } = require("express-validator")
const { transRegister } = require("./../../../lang/vi")
let registerValidation = [
    check("email", transRegister.email_incorect).isEmail().trim(),
    check("email", transRegister.email_not_empty).not().isEmpty(),
    check("gender", transRegister.gender_incorect).isIn(["male", "female"]),
    check("gender", transRegister.gender_incorect).not().isEmpty(),
    check("password", transRegister.password_incorect).isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("password", transRegister.password_not_empty).not().isEmpty(),
    check("password_confirmation", transRegister.re_password_incorect).custom((value, { req }) => {
        return value === req.body.password
    })
]
module.exports = {
    registerValidation: registerValidation
}