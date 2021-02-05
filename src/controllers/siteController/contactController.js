const { contactService } = require("./../../services/site/index")
let findUserContact = async(req, res) => {
    try {
        let currentUserId = req.user._id // session
        let keyword = req.params.keyword

        let users = await contactService.findUserContact(currentUserId, keyword)
        users = JSON.parse(JSON.stringify(users))
        return res.render('main/contact/section/findUserContact', { users })
    } catch (error) {
        return res.status(500).send(error)
    }
}
let addNewContact = async(req, res) => {
    try {
        let currentUserId = req.user._id // session
        let contactId = req.body.uid
        let newContact = await contactService.addNew(currentUserId, contactId)

        return res.status(200).send({ success: !!newContact }) // return success:true
    } catch (error) {
        return res.status(500).send(error)
    }
}
let removeRequestContactSent = async(req, res) => {
    try {
        let currentUserId = req.user._id // session
        let contactId = req.body.uid
        let removeContact = await contactService.removeRequestContactSent(currentUserId, contactId)
        return res.status(200).send({ success: !!removeContact }) // return success:true
    } catch (error) {
        return res.status(500).send(error)
    }
}
let getMoreContact = async(req, res) => {
    try {
        let skipNumberContact = +(req.query.skipNumber)
        let newContact = await contactService.readMore(req.user._id, skipNumberContact)
        return res.status(200).send(newContact)
    } catch (error) {
        return res.status(500).send(error)
    }
}
let getMoreContactSent = async(req, res) => {
    try {
        let skipNumberContact = +(req.query.skipNumber)
        let newContact = await contactService.readMoreSent(req.user._id, skipNumberContact)
        return res.status(200).send(newContact)
    } catch (error) {
        return res.status(500).send(error)
    }
}

let getMoreContactReceived = async(req, res) => {
    try {
        let skipNumberContact = +(req.query.skipNumber)
        let newContact = await contactService.getMoreContactReceived(req.user._id, skipNumberContact)
        return res.status(200).send(newContact)
    } catch (error) {
        return res.status(500).send(error)
    }
}
let removeRequestContactReceived = async(req, res) => {
    try {
        let currentUserId = req.user._id
        let contactId = req.body.uid

        let removeReq = await contactService.removeRequestContactReceived(currentUserId, contactId)
        return res.status(200).send({ success: !!removeReq })
    } catch (error) {
        return res.status(500).send(error)
    }
}
let approveRequestContactReceived = async(req, res) => {
    try {
        let currentUserId = req.user._id
        let contactId = req.body.uid

        let approveReq = await contactService.approveRequestContactReceived(currentUserId, contactId)
        return res.status(200).send({ success: !!approveReq })
    } catch (error) {
        return res.status(500).send(error)
    }
}
let removeContact = async(req, res) => {
    try {
        let currentUserId = req.user._id
        let contactId = req.body.uid

        let removeContact = await contactService.removeContact(currentUserId, contactId)
        return res.status(200).send({ success: !!removeContact })
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = {
    findUserContact: findUserContact,
    addNewContact: addNewContact,
    removeRequestContactSent: removeRequestContactSent,
    getMoreContact: getMoreContact,
    getMoreContactSent: getMoreContactSent,
    getMoreContactReceived: getMoreContactReceived,
    removeRequestContactReceived: removeRequestContactReceived,
    approveRequestContactReceived: approveRequestContactReceived,
    removeContact: removeContact
}