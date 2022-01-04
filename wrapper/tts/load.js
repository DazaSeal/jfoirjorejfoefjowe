/***
this file generates a tts mp3
***/

const express = require("express");
const router = express.Router();
const mp3Duration = require("mp3-duration");
const voices = require("./info").voices;
const asset = require("../asset/main");
const util = require("../misc/util");
const tts = require("./main");

router.post("/goapi/convertTextToSoundAsset/", (req, res) => {
	var movieId = req.body.movieId || req.body.presaveId;
	// generate tts mp3
	tts(req.body.voice, req.body.text).then((buffer) => {
		// get mp3 duration
		mp3Duration(buffer, (e, d) => {
			var dur = d * 1e3;
			if (e || !dur) { // no mp3
				res.end(1 + util.xmlFail("Unable to retrieve MP3 stream."));
			}

			const title = `[${voices[req.body.voice].desc}] ${req.body.text}`;
			// save clip, returns id
			const id = asset.save(buffer, movieId, "tts", "mp3");
			res.end(
				`0<response><asset><id>${id}</id><enc_asset_id>${id}</enc_asset_id><type>sound</type><subtype>tts</subtype><title>${title}</title><published>0</published><tags></tags><duration>${dur}</duration><downloadtype>progressive</downloadtype><file>${id}</file></asset></response>`
			);
		});
	}).catch((e) => res.end(1 + util.xmlFail(e)));
});

module.exports = router;
