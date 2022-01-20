const express = require("express"),
	router = express.Router(),
	Movie = require("../models/movie");

router.post("/saveTemplate/", async (req, res) => {
	id = await Movie.save(req.body.body_zip, req.body.thumbnail_large, req.body.movieId, req.body.is_triggered_by_autosave, true);
	if(!id) { //an error happened
		console.error("Error while saving starter.")
		res.status(500).end("1")
	}
	else
		res.end(`0${id}`)
})
router.post("/saveMovie/", async (req, res) => {
	id = await Movie.save(req.body.body_zip, req.body.thumbnail_large, req.body.movieId, req.body.is_triggered_by_autosave);
	if(!id) { //an error happened
		console.error("Error while saving movie.")
		res.status(500).end("1")
	}
	else
		res.end(`0${id}`)
})

module.exports = router
