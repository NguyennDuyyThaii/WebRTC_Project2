const {contactService} = require("./../../services/site/index")
let findUserContact = async (req,res) => {
    try {
        let currentUserId = req.user._id// session
        let keyword = req.params.keyword

        let users = await contactService.findUserContact(currentUserId,keyword)
            users = JSON.parse(JSON.stringify(users))
            return res.render('main/contact/section/findUserContact',{users})
    } catch (error) {
        return res.status(500).send(error)
    }
}
let addNewContact = async (req,res) => {
    try {
        let currentUserId = req.user._id// session
        let contactId = req.body.uid
        let newContact = await contactService.addNew(currentUserId,contactId)
        
        return res.status(200).send({success: !!newContact})// return success:true
    } catch (error) {
        return res.status(500).send(error)
    }
}
let removeRequestContact = async (req,res) => {
    try {
        let currentUserId = req.user._id// session
        let contactId = req.body.uid
        let removeContact = await contactService.removeRequestContact(currentUserId,contactId)
        return res.status(200).send({success: !!removeContact})// return success:true
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    findUserContact: findUserContact,
    addNewContact: addNewContact,
    removeRequestContact: removeRequestContact
}