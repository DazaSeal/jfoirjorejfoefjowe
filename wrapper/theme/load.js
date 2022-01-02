/***
this file lists themes
***/

const express = require("express");
const router = express.Router();
const fUtil = require("../misc/file");

router.post("/goapi/getTheme/", function (req, res) {
	const theme = req.body.themeId;
	// Fix theme id
	switch (theme) {
		case "family":
			theme = "custom";
			break;
	}
	res.set("Content-Type", "application/zip");
	fUtil.makeZip(`./_THEMES/${theme}.xml`, "theme.xml").then((b) => res.end(b));
});

module.exports = router;
