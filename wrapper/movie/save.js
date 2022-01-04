/***
this file saves movies
***/

const express = require("express");
const router = express.Router();
const movie = require("./main");

router.post("/goapi/saveMovie/", (req, res) => {
	const trigAutosave = req.body.is_triggered_by_autosave;
	if (trigAutosave && (!req.body.movieId || req.body.noAutosave)) return res.end("0");

	var bodyZip = Buffer.from(req.body.body_zip, "base64");
	var thumb = req.body.thumbnail_large && Buffer.from(req.body.thumbnail_large, "base64");
	var movieId = req.body.movieId || req.body.presaveId;
	movie.save(bodyZip, thumb, movieId, req.body.presaveId)
		.then((nId) => res.end("0" + nId));
});

module.exports = router;
