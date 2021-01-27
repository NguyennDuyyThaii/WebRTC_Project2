const UserModel = require("./../../models/userModel")
const {transRegister, Registermailer} = require("./../../../lang/vi")
const {v4: uuidv4} = require("uuid")
const bcrypt = require("bcrypt")
const sendMail = require("./../../configs/mailer")

let saltRound = 7
/**
 * 
 * @param {*} email 
 * @param {*} gender 
 * @param {*} password 
 * @param {*} protocol 
 * @param {*} host 
 */
let register = (email,gender, password, protocol, host ) => {
    return new Promise(async (resolve,reject) => {
        /**
         * check if the email has created
         */
        let userByEmail = await UserModel.findByEmail(email)
        if(userByEmail){
            /**
             * check if the account has deleted
             */
            if(userByEmail.deletedAt != null){
                return reject(transRegister.account_removed)
            }
            /**
             * check if the account is not active
             */
            if(!userByEmail.local.isActice){
                return reject(transRegister.account_not_active)
            }
            return reject(transRegister.email_in_use)
        }
        let salt = bcrypt.genSaltSync(saltRound)

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password,salt),
                verifyToken: uuidv4()
            }
        }

        let user = await UserModel.createNew(userItem)
        
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
        sendMail(email,Registermailer.subject, Registermailer.template(linkVerify))
            .then(success => {
                resolve(transRegister.userCreated(user.local.email))
            })
            .catch(async (error) => {
                /**
                 * delete all infomation of client
                 */
                await UserModel.removeById(user._id)
                reject(Registermailer.send_faild)
            })
    })
}
/**
 * 
 */
let verifyAccount = (token) => {
   return new Promise(async (resolve,reject) => {
       await UserModel.verify(token)
       resolve(Registermailer.account_actived)
   })
}
module.exports = {
    register: register,
    verifyAccount: verifyAccount
}