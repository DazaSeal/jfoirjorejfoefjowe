/***
short version of https.get()
***/

const https = require("https");
const http = require("http");

module.exports = function (url, options = {}) {
	var data = [];
	return new Promise((res, rej) => {
		try {
			http.get(url, options, (response) =>
				response
					.on("data", (v) => data.push(v)) // push data to object
					.on("end", () => res(Buffer.concat(data))) // return data
					.on("error", rej)
			);
		} catch(err) {
			https.get(url, options, (response) =>
				response
					.on("data", (v) => data.push(v)) // push data to object
					.on("end", () => res(Buffer.concat(data))) // return data
					.on("error", rej)
			);
		}
	});
};
