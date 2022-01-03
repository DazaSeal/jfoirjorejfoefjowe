/***
this file redirects legacy character links
***/

const express = require("express");
const router = express.Router();
const defaultTypes = {
	family: "adam",
	anime: "guy",
};

// new char
router.get("/go/character_creator/:themeId/new_char", (req, res) => {
	var type = req.query.type || defaultTypes[req.params.themeId] || "";
	redirect = `/cc?themeId=${req.params.themeId}&bs=${type}`;
	res.set("Location", redirect);
	res.status(302).end();
});
// copy char
router.get("/go/character_creator/:themeId/copy/:charId", (req, res) => {
	redirect = `/cc?themeId=${req.params.themeId}&original_asset_id=${req.params.charId}`;	
	res.set("Location", redirect);
	res.status(302).end();
});

module.exports = router;
