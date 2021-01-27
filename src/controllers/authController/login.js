let getLogin = (req,res) => {
    return res.render('auth/signIn', {
        success: req.flash("success"),
        errors: req.flash("errors")
    })
}
module.exports = {
    getLogin: getLogin
}