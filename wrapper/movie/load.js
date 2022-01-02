/***
this file loads movies
***/

const express = require("express");
const router = express.Router();
const movie = require("./main");
const base = Buffer.alloc(1, 0);

router.get("/movies/m-:movieId.:extension/", (req, res) => {
	switch (req.params.extension) {
		case "zip":
			res.set("Content-Type", "application/zip");
			movie.loadZip(req.params.movieId).then((zip) => {
				if (zip) {
					res.statusCode = 200;
					res.end(zip);
				} else { // 404 error
					res.statusCode = 404;
					res.sendFile(__dirname + "../public/404.html");
				}
			});
			break;
		default:
			res.set("Content-Type", "text/xml");
			movie.loadXml(req.params.movieId).then((xml) => {
				if (xml) {
					res.statusCode = 200;
					res.end(xml);
				} else {
					res.statusCode = 404;
					res.sendFile(__dirname + "../public/404.html");
				}
			});
			break;
	}
});
router.post("/goapi/getMovie/", (req, res) => {
	res.set("Content-Type", "application/zip");
	movie.loadZip(req.body.movieId)
		.then((b) => res.end(Buffer.concat([base, b])))
		.catch((err) => res.end("1"));
});

module.exports = router;
