/***
this file lists the themes
***/

const express = require("express");
const router = express.Router();
const fUtil = require("../misc/file");
let themelist;

router.post("/goapi/getThemeList/", (req, res) => {
	if(req.cookies.shortthemelist)
		themelist = `./_THEMES/_short-themelist.xml`;
	else
		themelist = `./_THEMES/_themelist.xml`;
	res.set("Content-Type", "application/zip");
	fUtil.makeZip(themelist, "themelist.xml").then((zip) => res.end(zip));
});

module.exports = router;
