// Editor → front end, the way a user meets the block:
//  1. insert "Stepped Content" from the inserter, get the template steps, add one, publish
//  2. the published post renders every step and the nav switches between them
//  3. a post created through REST (no editor involved) hydrates on the front end
const { test, expect } = require('@playwright/test');

const BLOCK_MARKUP = '<!-- wp:stp/content --><!-- wp:stp/step {"title":"One"} --><!-- wp:paragraph --><p>first</p><!-- /wp:paragraph --><!-- /wp:stp/step --><!-- wp:stp/step {"title":"Two"} --><!-- wp:paragraph --><p>second</p><!-- /wp:paragraph --><!-- /wp:stp/step --><!-- /wp:stp/content -->';

// The post editor renders blocks inside an iframe when every registered block supports it; fall back to the page otherwise.
const canvas = async page => {
	const iframe = page.locator('iframe[name="editor-canvas"]');
	return (await iframe.count()) ? page.frameLocator('iframe[name="editor-canvas"]') : page;
};

const collectPageErrors = page => {
	const errors = [];
	page.on('pageerror', err => errors.push(err.message));
	return errors;
};

// Front-end assertions shared by the editor-made and the REST-made post
const expectFrontEnd = async (page, url, stepCount) => {
	const errors = collectPageErrors(page);
	await page.goto(url);

	const block = page.locator('.wp-block-stp-content').first();
	await expect(block).toBeVisible();
	await expect(block).not.toHaveAttribute('data-props', /.+/, { timeout: 15_000 }); // view.js removes it once hydrated

	await expect(block.locator('.stpSteps > .stpStep')).toHaveCount(stepCount);
	const navItems = block.locator('.stpMenu .numberCount li');
	await expect(navItems).toHaveCount(stepCount);
	await expect(navItems.nth(0)).toHaveClass(/running/);

	await navItems.nth(1).locator('a').click();
	await expect(navItems.nth(1)).toHaveClass(/running/);
	await expect(navItems.nth(0)).toHaveClass(/complete/);

	await block.locator('.nextBtn').click();
	await expect(navItems.nth(2)).toHaveClass(/running/);

	expect(errors, 'uncaught JS errors on the front end').toEqual([]);
};

test.describe('Stepped Content', () => {
	let postUrl;

	test('inserts the block in the editor, adds a step and publishes', async ({ page }) => {
		const errors = collectPageErrors(page);

		await page.goto('/wp-admin/post-new.php');
		// Skip the welcome guide; both preference scopes have been used across WordPress versions
		await page.evaluate(() => {
			const prefs = window.wp?.data?.dispatch('core/preferences');
			prefs?.set('core/edit-post', 'welcomeGuide', false);
			prefs?.set('core', 'welcomeGuide', false);
		});
		await page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: /close/i }).click({ timeout: 3_000 }).catch(() => {});

		await page.getByRole('button', { name: /block inserter/i }).first().click();
		await page.getByRole('searchbox', { name: /search/i }).fill('Stepped Content');
		await page.getByRole('option', { name: 'Stepped Content', exact: true }).click();

		const editor = await canvas(page);
		const block = editor.locator('[data-type="stp/content"]').first();
		await expect(block).toBeVisible();

		const steps = block.locator('[data-type="stp/step"]');
		await expect(steps, 'the template fills four steps').toHaveCount(4);
		await expect(steps.first()).toContainText('Digital Marketing');

		// The appender (labelled "Add step") inserts a step directly (directInsert + defaultBlock)
		await block.getByRole('button', { name: /add (step|block)/i }).first().click();
		await expect(steps).toHaveCount(5);

		await page.getByRole('button', { name: 'Publish', exact: true }).click();
		await page.getByLabel('Editor publish').getByRole('button', { name: 'Publish', exact: true }).click();
		const viewLink = page.getByRole('link', { name: /view post/i }).first();
		await expect(viewLink).toBeVisible();
		postUrl = await viewLink.getAttribute('href');

		expect(errors, 'uncaught JS errors in the editor').toEqual([]);
	});

	test('renders the published post with working navigation', async ({ page }) => {
		test.skip(!postUrl, 'depends on the editor test');
		await expectFrontEnd(page, postUrl, 5);
	});

	test('hydrates a post created through REST', async ({ page }) => {
		await page.goto('/wp-admin/');
		const nonce = await (await page.request.get('/wp-admin/admin-ajax.php?action=rest-nonce')).text();

		// ?rest_route= works with plain permalinks too (wp-env's default), /wp-json/ does not
		const created = await page.request.post('/?rest_route=/wp/v2/posts', {
			headers: { 'X-WP-Nonce': nonce.trim() },
			data: { title: 'E2E REST post', status: 'publish', content: BLOCK_MARKUP }
		});
		expect(created.ok(), await created.text()).toBeTruthy();
		const { link } = await created.json();

		await expectFrontEnd(page, link, 2);
	});
});
