const asyncMiddleware = require("./utils").asyncMiddleware;

const http = require("http");
const express = require("express");
const app = express();

const runWebSocket = require("./chrome").runWebSocket;

app.get("/", async (req, res) => {
	return res.json({
		hello: "Chrome API",
		version: require("./package").version
	});
});

app.get("/puppeteer", (req, res) => {
	const puppeteer = require("puppeteer/package.json");
	return res.json({
		"Puppeteer-Version": puppeteer.version,
		"Chromium-Revision": puppeteer.puppeteer.chromium_revision
	});
});

http
	.createServer(async (req, res) => {
		return app(req, res);
	})
	.on("upgrade", asyncMiddleware(runWebSocket))
	.listen(process.env.PORT || 3000);
