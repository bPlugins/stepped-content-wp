<?php
/**
 * Plugin Name: Stepped Content
 * Description: Seamlessly organize your information into interactive steps.
 * Version: 1.0.7
 * Author: bPlugins
 * Author URI: https://bplugins.com
 * Plugin URI: https://bplugins.com/products/stepped-content
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: stepped-content
 * Requires at least: 6.5
 * Tested up to: 7.0
 * Requires PHP: 7.4
 * @fs_free_only /vendor/freemius-lite, /includes/fs-lite.php
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) { exit; }

if ( function_exists( 'stp_fs' ) ) {
	stp_fs()->set_basename( true, __FILE__ );
} else {
	define( 'STP_VERSION', ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ? time() : '1.0.7' );
	define( 'STP_DIR_URL', plugin_dir_url( __FILE__ ) );
	define( 'STP_DIR_PATH', plugin_dir_path( __FILE__ ) );

	require_once STP_DIR_PATH . 'includes/fs-lite.php';
	require_once STP_DIR_PATH . 'includes/GetCSS.php';
	require_once STP_DIR_PATH . 'includes/admin/SubMenu.php';

	if( !class_exists( 'STPPlugin' ) ) {
		/**
		 * STPPlugin Class.
		 * Main initialization class for the Stepped Content plugin.
		 *
		 * @package STP
		 */
		class STPPlugin {
			/**
			 * Constructor.
			 * Sets up hooks for initializing the plugin, registering assets, and default templates.
			 */
			public function __construct(){
				add_action( 'init', [$this, 'onInit'] );
				add_action( 'admin_enqueue_scripts', [$this, 'adminEnqueueScripts'] );
				add_action( 'enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets'] );

				add_filter( 'plugin_action_links', [$this, 'pluginActionLinks'], 10, 2 );
				add_filter( 'default_title', [$this, 'defaultTitle'], 10, 2 );
				add_filter( 'default_content', [$this, 'defaultContent'], 10, 2 );
			}
			
			/**
			 * Filters the default post title to set custom title if requested via URL with nonce verification.
			 *
			 * @param string $title The default post title.
			 * @param \WP_Post $post The post object.
			 * @return string The filtered post title.
			 */
			public function defaultTitle( $title, $post ) {
				if ( 'page' === $post->post_type && isset( $_GET['title'] ) ) {
					$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';

					if ( wp_verify_nonce( $nonce, 'stpCreatePage' ) ) {
						return sanitize_text_field( wp_unslash( $_GET['title'] ) );
					}
				}
				return $title;
			}

			/**
			 * Filters the default post content to set custom block markup if requested via URL with nonce verification.
			 *
			 * @param string $content The default post content.
			 * @param \WP_Post $post The post object.
			 * @return string The filtered post content.
			 */
			public function defaultContent( $content, $post ) {
				if ( 'page' === $post->post_type && isset( $_GET['content'] ) ) {
					$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';

					if ( wp_verify_nonce( $nonce, 'stpCreatePage' ) ) {
						return wp_kses_post( wp_unslash( $_GET['content'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					}
				}
				return $content;
			}

			/**
			 * Filters the action links displayed on the plugins page for this plugin.
			 * Adds a "Help & Demos" action link.
			 *
			 * @param string[] $links An array of plugin action links.
			 * @param string $file Path to the plugin file relative to the plugins directory.
			 * @return string[] The filtered plugin action links.
			 */
			public function pluginActionLinks( $links, $file ) {
				if( plugin_basename( __FILE__ ) === $file ) {
					$helpDemosLink = admin_url( 'tools.php?page=stepped-content#/pricing' );

					$links['help-and-demos'] = sprintf( '<a href="%s" style="%s">%s</a>', $helpDemosLink, 'color:#FF7A00;font-weight:bold', __( 'Help & Demos', 'stepped-content' ) );
				}
	
				return $links;
			}

			/**
			 * Initializes block registrations and adjusts conflicting scripts on init hook.
			 * Registers block types from build metadata.
			 *
			 * @return void
			 */
			public function onInit(){
				register_block_type( __DIR__ . '/build/content' );
				register_block_type( __DIR__ . '/build/step' );

				wp_deregister_script( 'stp-step-editor-script' );
			}

			/**
			 * Enqueues styles and scripts for the admin dashboard.
			 *
			 * @param string $hook The current admin page hook.
			 * @return void
			 */
			public function adminEnqueueScripts( $hook ) {
				if( strpos( $hook, 'stepped-content' ) ){
					wp_enqueue_style( 'stp-admin-dashboard', STP_DIR_URL . 'build/admin/dashboard.css', [], STP_VERSION );

					$asset_file = include STP_DIR_PATH . 'build/admin/dashboard.asset.php';
					wp_enqueue_script( 'stp-admin-dashboard', STP_DIR_URL . 'build/admin/dashboard.js', array_merge( $asset_file['dependencies'], [ 'wp-util' ] ), STP_VERSION, true );
					wp_set_script_translations( 'stp-admin-dashboard', 'stepped-content', STP_DIR_PATH . 'languages' );
				}
			}

			/**
			 * Enqueues inline scripts to pass license status and pricing URL to the block editor assets.
			 *
			 * @return void
			 */
			public function enqueueBlockEditorAssets(){
				wp_add_inline_script( 'stp-content-editor-script', 'const stppricingurl = "tools.php?page=stepped-content#/pricing"', 'before' );
			}

			/**
			 * Renders the admin dashboard container with encoded plugin configurations.
			 *
			 * @return void
			 */
			public static function renderDashboard(){ ?>
				<div
					id='stpDashboard'
					data-info='<?php echo esc_attr( wp_json_encode( [
						'version' => STP_VERSION,
						'adminUrl' => admin_url(),
						'startUrl' => admin_url( 'post-new.php?post_type=page&title=' . rawurlencode( 'Stepped Content' ) . '&content=' . rawurlencode( '<!-- wp:stp/content /-->' ) . '&nonce=' . wp_create_nonce( 'stpCreatePage' ) )
					] ) ); ?>'
				></div>
			<?php }
		}
		new STPPlugin;
	}
}