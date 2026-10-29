// Playwright config for the Stepped Content e2e suite.
//
// Targets a running WordPress with the plugin active. In CI that is wp-env on
// http://localhost:8888 (admin / password). Override with:
//   WP_BASE_URL   site URL
//   WP_USERNAME / WP_PASSWORD   an administrator
//   CHROMIUM_PATH   use an already-installed Chromium instead of Playwright's
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
	testDir: './specs',
	timeout: 90_000,
	expect: { timeout: 15_000 },
	fullyParallel: false,
	workers: 1,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI
		? [['list'], ['github'], ['html', { open: 'never' }]]
		: [['list'], ['html', { open: 'never' }]],
	globalSetup: require.resolve('./global-setup'),
	outputDir: 'test-results',
	use: {
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		storageState: 'playwright/.auth/admin.json',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'off',
		launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }
	]
});
