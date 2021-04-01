const { validationResult } = require("express-validator")
const { registerService } = require("../../services/auth/index")
const { transRegister } = require("../../../lang/vi")
let getRegister = (req, res) => {
    res.render('auth/signUp', {
        errors: req.flash("errors"),
        success: req.flash("success")
    })
}
let postRegister = async(req, res) => {
    let errorsArr = []
    let successArr = []
    let validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped())
        errors.forEach(item => {
            errorsArr.push(item.msg)
        })
        req.flash("errors", errorsArr)
        return res.redirect('/register')
    }
    try {
        let userSuccess = await registerService.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host"))
        successArr.push(userSuccess)
        req.flash("success", successArr)
        return res.redirect('/login')
    } catch (error) {
        errorsArr.push(error)
        req.flash("errors", errorsArr)
        return res.redirect('/register')
    }
}
let verify = async(req, res) => {
    let errorsArr = []
    let successArr = []
    try {
        let verifySuccess = await registerService.verifyAccount(req.params.token)
        successArr.push(verifySuccess)
        req.flash("success", successArr)
        return res.redirect('/login')
    } catch (error) {
        errorsArr.push(error)
        req.flash("errors", errorsArr)
        return res.redirect('/register')
    }
}
module.exports = {
    getRegister: getRegister,
    postRegister: postRegister,
    verify: verify
}