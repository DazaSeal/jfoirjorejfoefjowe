/***
this file lists movies
***/

const express = require("express");
const router = express.Router();
const movie = require("./main");

router.get("/api/getMovieList/", function (req, res) {
	Promise.all(movie.list().map(movie.meta)).then((a) => res.send(JSON.stringify(a)));
});

module.exports = router;
