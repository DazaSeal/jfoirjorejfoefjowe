/***
this file saves uploaded movies
***/

const express = require("express");
const router = express.Router();
const fUtil = require("../misc/file");
const parse = require("./parse");

router.post("/api/uploadMovie", (req, res) => {
	if (req.files.import.mimetype !== "text/xml")
		res.status(400).end();
	var numId = fUtil.getNextFileId("movie-", ".xml");
	parse.unpackXml(req.files.import.data, `m-${numId}`);

	var url = `/go_full?movieId=m-${numId}`;
	res.set("Location", url);
	res.status(302).end();
});

module.exports = router;
