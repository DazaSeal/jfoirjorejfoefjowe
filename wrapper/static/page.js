/***
this file generates flash pages
***/

const express = require("express");
const router = express.Router();
const fUtil = require("../misc/file");
const stuff = require("./info");
var attrs, params, title, html = "";

/**
generate the html
**/
function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join("\n");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}
function htmlString(req, res) {
	Object.assign(params.flashvars, req.query);
	res.send(`
		<html>
			<head>
				<title>${title}</title>
				<link rel="stylesheet" type="text/css" href="./pages/css/global.css" />
				<link rel="stylesheet" type="text/css" href="./pages/css/flash.css" />
				<script>
					flashvars = ${JSON.stringify(params.flashvars)}
				</script>
				<script src="/pages/js/jquery.js"></script>
			</head>
			<body style="margin:0px">
				${toObjectString(attrs, params)}
			</body>
			${html}
		</html>
	`);
	// i hate this so much
	// i hate it
}

/**
flashvar stuff
**/
router.get("/cc", (req, res) => { // character creator
	title = "Character Creator";
	attrs = {
		data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: req.query.id || null,
			themeId: "business",
			ut: 60,
			bs: "default",
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
	};
	html = `
		<script>
			function characterSaved() {
				$(window).attr("location", "/");
			}
		</script>`
	htmlString(req, res)
});
router.get("/cc_browser", (req, res) => { // character browser
	title = "Character Browser";
	attrs = {
		data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: req.query.id || null,
			themeId: "family",
			ut: 60,
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
			lid: 13,
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
	};
	htmlString(req, res)
});
router.get("/go_full", (req, res) => { // video editor
	let presave =
		req.query.movieId && req.query.movieId.startsWith("m")
			? req.query.movieId
			: `m-${fUtil[req.query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
	title = "Video Editor";
	attrs = {
		data: process.env.SWF_URL + "/go_full.swf",
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			isEmbed: 1,
			ctc: "go",
			ut: 50,
			bs: "default",
			appCode: "go",
			page: "",
			siteId: "go",
			lid: 13,
			isLogin: "Y",
			retut: 1,
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			themeId: "business",
			tlang: "en_US",
			presaveId: presave,
			goteam_draft_only: 1,
			isWide: 1,
			collab: 0,
			nextUrl: "/",
		},
		allowScriptAccess: "always",
	};
	html = `
		<div id="preview_popup" class="popup_container" style="display:none">
			<nav class="popup">
				<nav class="popup_head">
					<h2 id="preview-video">Preview Video</h2>
					<h2 class="close-button" onclick="hidePreviewer()">✖</h2>
				</nav>
				<object data="${process.env.SWF_URL}/player.swf" type="application/x-shockwave-flash" id="preview_player" height="360" width="640">
					<param name="flashvars"
						value="apiserver=/&movieId=flashvars.presaveId&isEmbed=1&tlang=en_US&isInitFromExternal=1&startFrame=previewStartFrame&autostart=1&storePath=${process.env.STORE_URL}/<store>&clientThemePath=${process.env.CLIENT_URL}/<client_theme>" />
					<param name="allowScriptAccess" value="always" />
					<param name="allowFullScreen" value="true" />
				</object>
			</nav>
		</div>
		<iframe style='display:none'name='dummy'></iframe>
		<form style='display:none' id='uploadbanner' enctype='multipart/form-data' method='post' action='/api/uploadAsset' target='dummy'>
			<input type='text' name='params' />
			<input id='fileupload' name='import' type='file' onchange='importComplete(this)' accept='.mp3,.wav,.png,.jpg' />
			<input type='submit' value='submit' id='submit' />
		</form>
		<script>
			interactiveTutorial = {
				neverDisplay:function() {
					return true
				}
			};
			function studioLoaded(arg) { console.log(arg) }
			function initPreviewPlayer(xml) {
				confirm('Before proceeding, please make sure all your changes have been saved.')&&window.open('player?movieId='+flashvars.presaveId,'MsgWindow','width=1280,height=723,left='+(screen.width/2-640)+',top='+(screen.height/2-360))
			}
			function exitStudio() { window.location = '/' }

			function initPreviewPlayer(dataXmlStr, startFrame, containsChapter, themeList) {
				movieDataXmlStr = dataXmlStr;
				filmXmlStr = dataXmlStr.split("<filmxml>")[1].split("</filmxml>")[0];
				$("#preview_popup").css("display", "block");
			}
			function hidePreviewer() { $("#preview_popup").css("display", "none") }
			function retrievePreviewPlayerData() { return movieDataXmlStr }

			const fu = document.getElementById('fileupload'),
				sub = document.getElementById('submit');
			function showImporter() { fu.click() }
			function importComplete(obj) {
				const file = obj.files[0];
				if(file != undefined) {
					const ext = file.name.substring(file.name.lastIndexOf('.')+1);
					var params = flashvars.presaveId + '.';
					if(ext == 'mp3' || ext == 'wav') {
						var c;
						while(c!='vo'&&c!='se'&&c!='mu') {
							c = prompt('Would you like to upload this as a voiceover (\"vo\"), sound effect (\"se\"), or as music (\"mu\")?').toLowerCase()
						}
						params+=c
					} else if(ext == 'jpg' || ext == 'png') {
						var c;
						while(c!='bg'&&c!='prop') {
							c = prompt('Would you like to upload this as a background (\"bg\") or as a prop (\"prop\")?').toLowerCase()
						}
						params+=c
					}
					obj.parentElement.firstChild.value=params+'.'+ext;
					sub.click();
					return true
				}
			}
		</script>`
	htmlString(req, res)
});
router.get("/player", (req, res) => { // video player
	title = "Video Player";
	attrs = {
		data: process.env.SWF_URL + "/player.swf",
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			ut: 60,
			autostart: 1,
			isWide: 1,
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
		},
		allowScriptAccess: "always",
		allowFullScreen: "true",
	};
	htmlString(req, res)
});

module.exports = router;
