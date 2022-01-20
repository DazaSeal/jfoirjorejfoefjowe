const fUtil = require("../helpers/file"),
	folder = process.env.SAVED_FOLDER,
	nodezip = require("node-zip"),
	fs = require("fs");

/**
 * @summary Generates a random movie id
 * @returns {string}
 */
function newMovieId() {
	var id = fUtil.generateId()
	//check if id is taken
	return (checkIfSaved(id)) ? newMovieId() : id
}
/**
 * @summary Gets a movie id from filename
 * @param {string} id
 * @returns {string}
 */
var getMovieId = (id) => id.substring(6, -4)

/**
 * @summary Checks if a movie is saved
 * @param {string} id
 * @returns {string}
 */
function checkIfSaved(id) {
	fs.access(`${__dirname}/${process.env.SAVED_FOLDER}/movie-${id}.xml`, fs.constants.F_OK, (err) => {
		if (err) return true
		else return false
	})
}

exports.list = function(starter = false, sort = "descending") {
	var table = []
	const mode = (starter) ? "starter" : "movie"
	for(const filename of fs.readdirSync(`${__dirname}/${folder}`)) {
		if(filename.search("starter" === -1)) {
			fs.readFile(`${__dirname}/${folder}/${filename}`, (err, buffer) => {
				const xml = buffer.toString()
				const beg = xml.indexOf("<title>") + 7
				const end = xml.indexOf("</title>")
				const title = xml.substring(beg, end)
				fs.stat(`${__dirname}/${folder}/${filename}`, (err, data) => {
					var metadata = {
						title: title,
						date: data.mtime,
						id: getMovieId(filename)
					}
					table.push(metadata)
				})
			})
		}
	}
	console.log(table)
	return table
};


/**
 * @summary Unzips a movie, and saves it
 * @param {string} bytes
 * @param {string} thumb
 * @param {string} id
 * @param {boolean} autosave
 * @returns {string}
 */
exports.save = function(bytes, thumb, id = false, autosave = false, starter = false) {
	id = (!id) ? newMovieId() : id
	const mode = (starter) ? "starter" : "movie"
	if (autosave && checkIfSaved(id) || !autosave) {
		var zipBuffer = Buffer.from(bytes, "base64"),
			thumbBuffer = Buffer.from(thumb, "base64"),
			zip = nodezip.unzip(zipBuffer),
			xml = ""
		zip["movie.xml"].toReadStream()
			.on("data", b => xml = b)
			.on("end", async () => {
				fs.writeFile(`${__dirname}/${folder}/${mode}-${id}.xml`, xml, (err) => { return false })
				fs.writeFile(`${__dirname}/${folder}/${mode}-${id}.png`, thumbBuffer, (err) => { return false })
			});
	}
	return id
};
