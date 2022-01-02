/***
this file loads movie thumbnails
***/

const express = require("express");
const router = express.Router();
const movie = require("./main");

router.get("/movie_thumbs/:movieId.png", (req, res) => {
	movie
		.loadThumb(req.params.movieId)
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
