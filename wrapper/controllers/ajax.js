const express = require("express"),
	router = express.Router(),
	Movie = require("../models/movie");

router.get("/movie/list", async (req, res) => {
	const list = await Movie.list()
	console.log(list.join(""))
	json = {
		"status": "ok",
		"movies": [
			list.join("")
		]
	}
	res.json(json)
})

module.exports = router
