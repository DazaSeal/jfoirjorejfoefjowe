/***
this file loads character thumbnails
***/

const express = require("express");
const router = express.Router();
const character = require("./main");

router.get("/char_thumbs/:charId.png", (req, res) => {
	character.loadThumb(req.params.charId)
		.then((img) => {
			res.set("Content-Type", "image/png");
			res.statusCode = 200;
			res.send(img);
		})
		.catch(() => {
			res.statusCode = 400;
			res.send();
		});
});

module.exports = router;
