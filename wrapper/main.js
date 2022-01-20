/***
this file starts infinite
***/

const express = require("express"),
	app = express(),
	morgan = require("morgan"),
	cookieParser = require("cookie-parser"),
	compression = require("compression"),
	env = Object.assign(process.env, require("./json/env"));

//http logging
app.use(morgan("dev"))

//page templates
app.set("view engine", "pug")
app.set("views", "./views")

//gzip compression
app.use(compression())

//post body
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

//cookie parser, used for options like the short themelist
app.use(cookieParser())

//static files
app.use(express.static("public", { fallthrough: true }))

//the pages
app.use(require("./controllers"))

//MEAAAAAAAAAAAHH!
app.listen(process.env.PORT || 4343)
