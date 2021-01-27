
let getHome =  (req,res) => {
    // let item = {
    //     userId: '600947cde9cd920d1d6a1b61',
    //     contactId: '600803eb96b5be09913c081a',
    //     status: false
    // }
    // await contactService.createNew(item)
    return res.render('main/home/home')
}
module.exports = {
    getHome: getHome
}