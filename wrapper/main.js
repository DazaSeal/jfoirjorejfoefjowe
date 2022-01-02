/***
this file starts wrapper: offline
***/

// env and config.json
const env = Object.assign(process.env, require("./env"), require("./config"));


/**
stuff
**/
const express = require("express");
const app = express();
const reqBody = require('body-parser');
const stuff = require('./static/info');

app.use(reqBody.json());
app.use(reqBody.urlencoded({ extended: true }));
app.use("/", require("./asset/list"));
app.use(require("./character/premade"));
app.use("/", require("./movie/list"));
app.use("/", require("./movie/load"));
app.use("/", require("./movie/thumb"));
app.use("/", require("./static/page"));
app.use("/", require("./theme/list"));
app.use("/", require("./theme/load"));
app.use(express.static("public", { fallthrough: true })); // static files
app.all("*", (req, res) => { // info.json links
	const methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(req.url)) { // if it's the link
			const t = methodLinks[linkIndex];
			const link = (t.link || req.url);
			const headers = t.headers;
			for (var headerName in headers || {}) // set headers
				res.setHeader(headerName, headers[headerName]);
			res.statusCode = t.statusCode || 200;
			if (t.content !== undefined) res.end(t.content);
		}
	}
	res.status(404).sendFile(__dirname + "/public/404.html");
});

// start offline
app.listen(4343, () => {
  console.log("Wrapper: Offline has started!")
})
