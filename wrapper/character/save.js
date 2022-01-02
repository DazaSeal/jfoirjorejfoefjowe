/***
this file saves a character
***/

const express = require("express");
const router = express.Router();
const character = require("./main");

router.post("/goapi/saveCCCharacter/", (req, res) => {
	character.save(Buffer.from(req.body.body))
		.then((id) => {
			var thumb = Buffer.from(req.body.thumbdata, "base64");
			character.saveThumb(thumb, id);
			res.send(`0${id}`);
		})
		.catch(() => res.send(`10`))
});

router.post("/goapi/saveCCThumbs/", (req, res) => {
	var id = req.body.assetId;
	var thumb = Buffer.from(req.body.thumbdata, "base64");
	character.saveThumb(thumb, id);
	res.end(`0${id}`);
});

module.exports = router;
