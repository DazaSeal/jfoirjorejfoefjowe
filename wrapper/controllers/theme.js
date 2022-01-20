const express = require("express"),
	router = express.Router(),
	fUtil = require("../helpers/file");

//Zips the themelist
router.post("/getThemelist/", (req, res) => {
	const short = req.cookies.shortthemelist == 1
	//short themelist option
	let themelist = (short) ? `${__dirname}/${process.env.STORE_PATH}/_short-themelist.xml` : `${__dirname}/${process.env.STORE_PATH}/_themelist.xml`
	res.set("Content-Type", "application/zip")
	fUtil.makeZip(themelist, "themelist.xml")
		.then(zip => res.end(zip))
		.catch(err => { //idk how this would happen
			console.error("Themelist doesn't exist? " + err)
			return false
		})
})

//Zips the requested theme
router.post("/getTheme/", (req, res) => {
	res.set("Content-Type", "application/zip")
	fUtil.makeZip(`${__dirname}/${process.env.STORE_PATH}/${req.body.themeId}/theme.xml`, "theme.xml")
		.then(zip => res.end(zip))
		.catch(err => {
			console.error("Theme doesn't exist. " + err)
			return false
		})
})

module.exports = router
