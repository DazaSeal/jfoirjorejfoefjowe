/***
this file loads assets
***/

const express = require("express");
const router = express.Router();
const asset = require("./main");

/**case "GET": {
	const match = req.url.match(/\/assets\/([^/]+)\/([^.]+)(?:\.xml)?$/);
	if (!match) return;

	const mId = match[1];
	const aId = match[2];
	const b = asset.load(mId, aId);
	if (b) {
		res.statusCode = 200;
		res.end(b);
	} else {
		res.statusCode = 404;
		res.end(e);
	}
	return true;
}**/

router.post("/goapi/getAssetEx/", () => {
	next();
});
router.post("/goapi/getAsset/", (req, res) => {
	const movieId = req.body.movieId || req.body.presaveId;
	const aId = req.body.assetId || req.body.enc_asset_id;
	const b = asset.load(movieId, aId);
	if (b) {
		res.setHeader("Content-Length", b.length);
		res.end(b);
	} else
		res.status(404).end();		
});

module.exports = router;
