const express = require("express");
const router = express.Router();
const folder = process.env.PREMADE_FOLDER;
const fs = require("fs");

router.post("/goapi/getCCPreMadeCharacters", (req, res) => {
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	const p = `${folder}/${req.body.themeId}.xml`;
	fs.createReadStream(p).pipe(res);
});

module.exports = router
