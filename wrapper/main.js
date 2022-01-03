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
const reqBody = require("body-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const stuff = require("./static/info");


app.use(reqBody.json());
app.use(reqBody.urlencoded({ extended: true }));
// HTTP logging
app.use(morgan("dev"));
app.use(require("./asset/list"));
// file uploads
app.use(fileUpload());

// character
app.use(require("./character/load"));
app.use(require("./character/premade"));
app.use(require("./character/redirect"));
app.use(require("./character/save"));
app.use(require("./character/thumb"));
// movie
app.use(require("./movie/list"));
app.use(require("./movie/load"));
app.use(require("./movie/save"));
app.use(require("./movie/thumb"));
app.use(require("./movie/upload"));
// static
app.use(require("./static/page"));
// theme
app.use(require("./theme/list"));
app.use(require("./theme/load"));
 // static files
app.use(express.static("public", { fallthrough: true }));
// info.json links
app.all("*", (req, res) => {
	const methodLinks = stuff[req.method];
	for (let linkIndex in methodLinks) {
		var regex = new RegExp(linkIndex);
		if (regex.test(req.url)) { // if it's the link
			const t = methodLinks[linkIndex];
			const link = (t.link || req.url);
			const headers = t.headers;
			for (var headerName in headers || {}) // set headers
				res.set(headerName, headers[headerName]);
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
