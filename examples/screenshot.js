const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/image', async (req, res) => {
	const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:8081' })

	const page = await browser.newPage();

	await page.goto('http://www.example.com/');
	const screenshot = await page.screenshot();

	return res.end(screenshot, 'binary');
});

app.listen(8080);

/**
 * Open http://localhost:8080/image to view the screenshot
 */