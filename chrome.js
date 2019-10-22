const puppeteer = require("puppeteer");
const getPort = require("get-port");
const httpProxy = require("http-proxy");
const logger = require("./logger");

const launchChrome = async () => {
	const port = await getPort();

	logger.log("info", `launchChrome in port ${port}`);
	const args = [
		"--disable-dev-shm-usage",
		"--disable-gpu",
		"--remote-debugging-port=9222",
		"--no-sandbox",
		"--disable-background-networking",
		"--disable-default-apps",
		"--disable-extensions",
		"--disable-sync",
		"--disable-translate",
		"--headless",
		"--hide-scrollbars",
		"--metrics-recording-only",
		"--mute-audio",
		"--no-first-run",
		"--safebrowsing-disable-auto-update",
		"--ignore-certificate-errors",
		"--ignore-ssl-errors",
		"--ignore-certificate-errors-spki-list",
		"--user-data-dir=/tmp",
		`--remote-debugging-port=${port}`,
		"--remote-debugging-address=0.0.0"
	];

	return puppeteer.launch({ args });
};

const getBrowserInstance = () => {
	return new Promise(async resolve => {
		const browser = await launchChrome().catch(async error => {
			logger.log("error", "launchChrome failed", error);
		});
		resolve(browser);
	});
};

const runWebSocket = async (req, socket, head) => {
	const browser = await getBrowserInstance();

	// session timeout
	setTimeout(async () => {
		try {
			await browser.close();
		} catch (e) {
		}
	}, 60000);

	req.proxy = new httpProxy.createProxyServer();
	req.proxy.on("open", async (res, socket, head) => {
		logger.log("info", "Client connected");
	});

	req.proxy.on("error", async (err, req, res) => {
		logger.log("info", "proxy errors", err);
	});

	req.proxy.on("close", async (res, socket, head) => {
		logger.log("info", "Client disconnected");
	});

	const target = browser.wsEndpoint();

	return req.proxy.ws(req, socket, head, { target });
};

module.exports = {
	runWebSocket
};
