const express = require("express")
const ejsExtend = require("express-ejs-extend")


let configViewEngine = (app) => {
    app.use(express.static("src/public"))
    app.engine("ejs", ejsExtend)

    app.set("view engine", "ejs")
    app.set("views", "src/views")
}

module.exports = configViewEngine