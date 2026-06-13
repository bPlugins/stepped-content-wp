import { __ } from '@wordpress/i18n';

import { gutenbergTabIcon } from './icons';

const slug = 'stepped-content';

export const dashboardInfo = (info) => {
	const { version, startUrl, adminUrl = '' } = info;

	return {
		name: __('Stepped Content', 'stepped-content'),
		displayName: __('Stepped Content - Organize Content into Step-by-Step Format', 'stepped-content'),
		description: __('A powerful Gutenberg plugin for WordPress, revolutionizes content presentation. Seamlessly organize your information into interactive steps or tabs.', 'stepped-content'),
		slug,
		version,
		adminUrl,
		displayOurPlugins: true,
		media: {
			logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
			banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
			thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
			// proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
			video: '',
			isYoutube: true
		},
		pages: {
			org: `https://wordpress.org/plugins/${slug}/`,
			// landing: `https://bplugins.com/products/${slug}/`,
			// docs: `https://bplugins.com/docs/${slug}/`,
			pricing: `https://bplugins.com/products/${slug}/pricing/`,
		},
		freemius: {
			product_id: 15887,
			plan_id: 26468,
			public_key: 'pk_1ed890cdff6977232e0948f5f2ea8'
		},
		startButton: {
			label: __('Start Now', 'stepped-content'),
			url: startUrl
		}
	}
}

export const welcomeInfo = (adminUrl) => ({
	keywords: [__('Steps', 'stepped-content'), __('Tabs', 'stepped-content'), __('Navigation', 'stepped-content'), __('Customization', 'stepped-content')],
	keywordsLabel: __('Features', 'stepped-content'),
	gettingStarted: {
		tabs: [
			{
				key: 'gutenberg',
				label: __('Gutenberg', 'stepped-content'),
				icon: gutenbergTabIcon,
				steps: [
					{
						num: 1,
						title: __('Add the Stepped Content Block', 'stepped-content'),
						body: __('Open the block editor on any page or post. Click the <strong>+</strong> icon in the top-left corner or type <strong>/Stepped Content</strong> to find and insert the Stepped Content block.', 'stepped-content'),
						link: { url: `${adminUrl}/post-new.php?post_type=page`, label: __('Open Editor', 'stepped-content') }
					},
					{
						num: 2,
						title: __('Add Steps & Content', 'stepped-content'),
						body: __('Click the <strong>Add New Step</strong> button inside the block to add steps. Customize each step\'s background (image or color), title, and content settings.', 'stepped-content')
					},
					{
						num: 3,
						title: __('Configure Steps & Publish', 'stepped-content'),
						body: __('Select the parent block to configure layout settings in the sidebar: adjust step styles, transitions, navigation/pagination, and layout structure. Publish when ready.', 'stepped-content')
					}
				]
			}
		]
	},
	changelogs: [
		{
			version: '1.0.7 - 13 Jun 2026',
			type: 'update',
			list: [
				'Update: SDK',
				'Update: Performance Improvement'
			]
		},
		{
			version: '1.0.6 - 04 Mar 2026',
			type: 'update',
			list: [
				'Update: Admin Dashboard - Improved UI with better navigation and clearer feature organization.'
			]
		},
		{
			version: '1.0.5 - 30 Nov 2025',
			type: 'new',
			list: [
				'Add Admin Dashboard.',
				'Performance Improvement.'
			]
		},
		{
			version: '1.0.4 - 27 Jan 2025',
			type: 'update',
			list: [
				'Update SDK.'
			]
		},
		{
			version: '1.0.3 - 04 Jul 2024',
			type: 'fix',
			list: [
				'Fix the title visible issue.'
			]
		},
		{
			version: '1.0.2 - 29 Jun 2024',
			type: 'update',
			list: [
				'Upgrade for multiple features.'
			]
		}
	],
	changelogsLimit: 5,
	changelogsReadMoreLabel: 'View More Changelogs',
	proFeatures: [
		__('Show or hide top navigation bar', 'stepped-content'),
		__('Customize the appearance of the sidebar', 'stepped-content'),
		__('Configure dynamic back button content options', 'stepped-content'),
		__('Advanced theme and text color settings', 'stepped-content'),
		__('Custom backgrounds for every content step', 'stepped-content')
	]
})

export const demoInfo = {
	allInOneLabel: __('See All Demos', 'stepped-content'),
	allInOneLink: 'https://ctb.bplugins.com/all-demos-in-one-place/',
	demos: [
		{
			icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' id='layout-text-window-reverse'><path d='M13 6.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5m0 3a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5m-.5 2.5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z'/><path d='M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM2 1a1 1 0 0 0-1 1v1h14V2a1 1 0 0 0-1-1zM1 4v10a1 1 0 0 0 1 1h2V4zm4 0v11h9a1 1 0 0 0 1-1V4z'/></svg>`,
			title: __('Default View', 'stepped-content'),
			type: 'iframe',
			url: 'https://bblockswp.com/demo/stepped-content-default-view/'
		},
		{
			icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z'/></svg>`,
			title: __('Customization', 'stepped-content'),
			type: 'iframe',
			url: 'https://bblockswp.com/demo/stepped-content-customization/'
		},
		{
			icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' id='layout-sidebar-inset'><path d='M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z'/><path d='M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z'/></svg>`,
			title: __('Without Navbar', 'stepped-content'),
			type: 'iframe',
			url: 'https://bblockswp.com/demo/stepped-content-without-navbar/'
		},
		{
			icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z'/></svg>`,
			title: __('List Range Sidebar', 'stepped-content'),
			type: 'iframe',
			url: 'https://bblockswp.com/demo/stepped-content-list-range-sidebar/'
		},
		{
			icon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' id='code'><path d='M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z'/></svg>`,
			title: __('Icon in Back and Next button', 'stepped-content'),
			type: 'iframe',
			url: 'https://bblockswp.com/demo/stepped-content-icon-in-back-and-next-button/'
		}
	]
}

export const pricingInfo = {
	logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`, // Optional
	pluginId: 15887,
	planId: 26468,
	licenses: [
		1,
		3,
		null
	],
	button: {
		label: __('Buy Now ➜', 'stepped-content')
	},
	featured: {
		selected: 3, // choose from licenses item
		text: __('Best Value', 'stepped-content')
	}
}