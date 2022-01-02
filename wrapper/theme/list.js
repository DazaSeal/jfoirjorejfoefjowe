/***
this file lists the themes
***/

const express = require("express");
const router = express.Router();
const fUtil = require("../misc/file");

router.post("/goapi/getThemeList/", (req, res) => {
	res.set("Content-Type", "application/zip");
	fUtil.makeZip(`./_THEMES/_themelist.xml`, "themelist.xml").then((zip) => res.end(zip));
});

module.exports = router;
