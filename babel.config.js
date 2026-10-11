// Mirrors the default @wordpress/scripts babel setup, adding two i18n steps:
// - bpl-tools' strings get this plugin's text domain, so its translations apply to them
// - makepot extracts the strings from source during build. wp-cli's make-pot can't
//   parse build/index.js (the inlined Ace editor breaks its JS parser), so the
//   JS POT is generated here and merged in the i18n-pot script.
module.exports = {
	presets: ['@wordpress/babel-preset-default'],
	plugins: [
		['../bpl-tools/i18n/babel-plugin-text-domain', { domain: 'stepped-content' }],
		['@wordpress/babel-plugin-makepot', { output: 'languages/stepped-content-js.pot' }]
	]
};
