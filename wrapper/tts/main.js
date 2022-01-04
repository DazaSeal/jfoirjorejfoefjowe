const voices = require("./info").voices;
const qs = require("querystring");
const brotli = require("brotli");
const https = require("https");
const md5 = require("js-md5");
const Lame = require("node-lame").Lame;
const http = require("http");

// Fallback option for compatibility between Wrapper and https://github.com/Windows81/Text2Speech-Haxxor-JS.
let get;
try {
	get = require("../misc/get");
} catch {
	get = require("./get");
}

module.exports = (voiceName, text) => {
	return new Promise(async (res, rej) => {
		const voice = voices[voiceName];
		switch (voice.source) {
			case "polly": {
				console.log("polly voice generating...");
				var charsCount = text.length;
				var req = https.request(
					{
						hostname: "voicemaker.in",
						port: "443",
						path: "/voice/standard",
						method: "POST",
						headers: {
							"content-type": "application/json",
							"Cookie": "connect.sid=s%3AINKgxPKyJDALo-LMtoGlo6GPWQLgF9zn.tvjGNWiuxCZbUYVX8%2F6%2BlJZnjAy35aoZGYts1ufMch0; __stripe_mid=b6411c56-4b59-4d3a-b177-e545c9b0813b046b7d; __stripe_sid=e18074e8-49db-48ea-b086-794b2878e9a8fb2a1c",
							"csrf-token": "",
							origin: "https://voicemaker.in",
							referer: "https://voicemaker.in/",
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
							"x-requested-with": "XMLHttpRequest",
						},
					},
					(r) => {
						var buffers = [];
						r.on("data", (b) => buffers.push(b));
						r.on("end", () => {
							var json = JSON.parse(Buffer.concat(buffers));
							console.log(json);
							if(json.success !== true)
								rej;
							get(`https://voicemaker.in/${json.path}`).then((response) => res(response)).catch(rej);
						});
						r.on("error", rej);
					}
				);
				req.write(
					`{"Engine":"${voice.speech_engine}","Provider":"${voice.ai}","SpeechName":"${voiceName}","OutputFormat":"mp3","VoiceId":"${voice.arg}","LanguageCode":"${voice.language}-${voice.country}","charsCount":${charsCount},"SampleRate":"${voice.samplerate}","effect":"default","master_VC":"advanced","speed":"0","master_volume":"0","pitch":"0","Text":"${text}","TextType":"text","fileName":""}`
				);
				req.end();
				break;
			}
			case "cepstral":
			case "voiceforge": {
				/* Special thanks to ItsCrazyScout for helping us find the new VoiceForge link! */
				var q = qs.encode({
					"HTTP-X-API-KEY": "9a272b4",
					"voice": voice.arg,
					"msg": text,
					"email": "null",
				});
				http.get(
					{
						host: "api.voiceforge.com",
						path: `/swift_engine?${q}`,
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => {
							const encoder = new Lame({ output: "buffer", bitrate: 192, })
								.setBuffer(Buffer.concat(buffers));
							encoder.encode()
								.then(() => {
									res(encoder.getBuffer());
								})
						});
						r.on("error", rej);
					}
				);
				break;
			}
			case "vocalware": {
				var [eid, lid, vid] = voice.arg;
				var cs = md5(`${eid}${lid}${vid}${text}1mp35883747uetivb9tb8108wfj`);
				var q = qs.encode({
					EID: voice.arg[0],
					LID: voice.arg[1],
					VID: voice.arg[2],
					TXT: text,
					EXT: "mp3",
					IS_UTF8: 1,
					ACC: 5883747,
					cache_flag: 3,
					CS: cs,
				});
				var req = https.get(
					{
						host: "cache-a.oddcast.com",
						path: `/tts/gen.php?${q}`,
						headers: {
							Referer: "https://www.oddcast.com/",
							Origin: "https://www.oddcast.com/",
							"User-Agent":
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
						},
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => res(Buffer.concat(buffers)));
						r.on("error", rej);
					}
				);
				break;
			}
			case "acapela": {
				var buffers = [];
				var acapelaArray = [];
				for (var c = 0; c < 15; c++) acapelaArray.push(~~(65 + Math.random() * 26));
				var email = `${String.fromCharCode.apply(null, acapelaArray)}@gmail.com`;
				var req = https.request(
					{
						hostname: "acapelavoices.acapela-group.com",
						path: "/index/getnonce",
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					},
					(r) => {
						r.on("data", (b) => buffers.push(b));
						r.on("end", () => {
							var nonce = JSON.parse(Buffer.concat(buffers)).nonce;
							var req = http.request(
								{
									hostname: "acapela-group.com",
									port: "8080",
									path: "/webservices/1-34-01-Mobility/Synthesizer",
									method: "POST",
									headers: {
										"Content-Type": "application/x-www-form-urlencoded",
									},
								},
								(r) => {
									var buffers = [];
									r.on("data", (d) => buffers.push(d));
									r.on("end", () => {
										const html = Buffer.concat(buffers);
										const beg = html.indexOf("&snd_url=") + 9;
										const end = html.indexOf("&", beg);
										const sub = html.subarray(beg, end).toString();
										http.get(sub, (r) => {
											r.on("data", (d) => buffers.push(d));
											r.on("end", () => {
												res(Buffer.concat(buffers));
											});
										});
									});
									r.on("error", rej);
								}
							);
							req.end(
								qs.encode({
									req_voice: voice.arg,
									cl_pwd: "",
									cl_vers: "1-30",
									req_echo: "ON",
									cl_login: "AcapelaGroup",
									req_comment: `{"nonce":"${nonce}","user":"${email}"}`,
									req_text: text,
									cl_env: "ACAPELA_VOICES",
									prot_vers: 2,
									cl_app: "AcapelaGroup_WebDemo_Android",
								})
							);
						});
					}
				);
				req.end(
					qs.encode({
						json: `{"googleid":"${email}"`,
					})
				);
				break;
			}
			case "readloud": {
				const req = https.request(
					{
						host: "readloud.net",
						port: 443,
						path: voice.arg,
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							"User-Agent":
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36",
						},
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => {
							const html = Buffer.concat(buffers);
							const beg = html.indexOf("/tmp/");
							const end = html.indexOf(".mp3", beg) + 4;
							const sub = html.subarray(beg, end).toString();
							const loc = `https://readloud.net${sub}`;
			
							https.get(
								{
									host: "readloud.net",
									path: sub,
									headers: {
										"Content-Type": "application/x-www-form-urlencoded",
										"User-Agent":
											"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36",
									},
								},
								(r) => {
									buffers = [];
									r.on("data", (d) => buffers.push(d));
									r.on("end", () => res(Buffer.concat(buffers)));
								}
							);
						});
						r.on("error", rej);
					}
				);
				req.end(
					qs.encode({
						but1: text,
						butS: 0,
						butP: 0,
						butPauses: 0,
						but: "Submit",
					})
				);
				break;
			}
			case "cereproc": {
				const req = https.request(
					{
						hostname: "www.cereproc.com",
						path: "/themes/benchpress/livedemo.php",
						method: "POST",
						headers: {
							"content-type": "text/xml",
							"accept-encoding": "gzip, deflate, br",
							origin: "https://www.cereproc.com",
							referer: "https://www.cereproc.com/en/products/voices",
							"x-requested-with": "XMLHttpRequest",
							cookie: "Drupal.visitor.liveDemo=666",
						},
					},
					(r) => {
						var buffers = [];
						r.on("data", (d) => buffers.push(d));
						r.on("end", () => {
							const xml = String.fromCharCode.apply(null, brotli.decompress(Buffer.concat(buffers)));
							const beg = xml.indexOf("https://cerevoice.s3.amazonaws.com/");
							const end = xml.indexOf(".mp3", beg) + 4;
							const loc = xml.substr(beg, end - beg).toString();
							https.get(loc, (r) => {
								buffers = [];
								r.on("data", (d) => buffers.push(d));
								r.on("end", () => res(Buffer.concat(buffers)));
							});
						});
						r.on("error", rej);
					}
				);
				req.end(
					`<speakExtended key='666'><voice>${voice.arg}</voice><text>${text}</text><audioFormat>mp3</audioFormat></speakExtended>`
				);
				break;
			}
		}
	});
};
