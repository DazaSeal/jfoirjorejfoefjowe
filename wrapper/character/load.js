/***
this file loads a character
***/

const express = require("express");
const router = express.Router();
const character = require("./main");

router.get("/characters/:charId.png", (req, res) => {
	res.set("Content-Type", "text/xml");
	character.load(req.params.charId)
		.then((v) => res.status(200).end(v))
		.catch((e) => res.status(404).end(e));
});
router.post("/goapi/getCcCharCompositionXml/", (req, res) => {
	res.set({"Content-Type": "text/html", "charset": "UTF-8"});
	character.load(req.body.assetId || req.body.original_asset_id)
		.then((v) => {
			(res.statusCode = 200), res.end(0 + v);
		})
		//.catch(e => { res.statusCode = 404, res.end(1 + e) })

		// why send a 404 when you can use octanuary instead
		.catch(() =>
			character.load("a-400001035").then((v) => {
				console.log("Couldn't find that character, but it's okay, we loaded Octanuary instead.")
				(res.statusCode = 200), res.end(0 + v);
			})
		).catch(e => {
			console.log("But nobody came."),
			res.statusCode = 404, res.end(1 + e)
		});
});

module.exports = router;
