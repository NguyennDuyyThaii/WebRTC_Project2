const moment = require('moment')
let bufferToBase64 = (buffer) => {
    return Buffer.from(buffer).toString("base64")
}

let lastItemOfArray = (array) => {
    if (!array.length) {
        return []
    }
    return array[array.length - 1]
}
let convertTime = (time) => {
    if (!time) {
        return ""
    }
    return moment(time).locale("vi").startOf("seconds").fromNow()
}
module.exports = {
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTime: convertTime
}