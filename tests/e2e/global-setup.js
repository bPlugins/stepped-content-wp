// Logs in once and saves the admin session for every test.
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

module.exports = async config => {
	const { baseURL, storageState, launchOptions } = config.projects[0].use;
	const username = process.env.WP_USERNAME || 'admin';
	const password = process.env.WP_PASSWORD || 'password';

	fs.mkdirSync(path.dirname(storageState), { recursive: true });

	const browser = await chromium.launch(launchOptions);
	const page = await browser.newPage({ baseURL });

	await page.goto('/wp-login.php');
	await page.fill('#user_login', username);
	await page.fill('#user_pass', password);
	await page.click('#wp-submit');
	await page.waitForURL(/wp-admin/);

	await page.context().storageState({ path: storageState });
	await browser.close();
};
